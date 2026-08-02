use std::collections::{BTreeMap, BTreeSet};

use crate::flue::events::ConversationChunk;
use crate::history::{
    TranscriptActivity, TranscriptActivityKind, TranscriptActivityStatus,
    TranscriptAssistantMessage, TranscriptExchange, TranscriptPrompt, TranscriptPromptVisibility,
};

const MAX_THINKING_PREVIEW_CHARS: usize = 500;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TranscriptLineKind {
    User,
    Assistant,
    Thinking,
    Tool,
    Task,
    Operation,
    Log,
    Error,
    System,
    Preflight,
    Other,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TranscriptLine {
    pub id: String,
    pub text: String,
    pub kind: TranscriptLineKind,
    pub is_streaming: bool,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct TranscriptNotice {
    pub id: String,
    pub speaker: String,
    pub text: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum TranscriptBlock {
    Notice(String),
    Exchange(String),
}

#[derive(Debug, Clone, Default)]
pub struct TranscriptDocument {
    notices: Vec<TranscriptNotice>,
    notice_index: BTreeMap<String, usize>,
    exchanges: Vec<TranscriptExchange>,
    exchange_index: BTreeMap<String, usize>,
    submission_index: BTreeMap<String, usize>,
    blocks: Vec<TranscriptBlock>,
    snapshot_submissions: BTreeSet<String>,
    resumable_snapshot_submissions: BTreeSet<String>,
    seen_chunks: BTreeSet<String>,
    streaming_text: BTreeMap<String, String>,
    pending_text: BTreeMap<String, String>,
    notice_sequence: u64,
    pending_sequence: u64,
}

impl TranscriptDocument {
    pub fn install_snapshot(&mut self, exchanges: Vec<TranscriptExchange>) -> usize {
        self.append_snapshot(exchanges)
    }

    pub fn prepend_snapshot(&mut self, exchanges: Vec<TranscriptExchange>) -> usize {
        let mut inserted_exchanges = Vec::new();
        let mut inserted_ids = Vec::new();
        for exchange in exchanges {
            if self.contains_exchange(&exchange.id, &exchange.submission_id) {
                continue;
            }
            self.track_snapshot_submission(&exchange);
            inserted_ids.push(exchange.id.clone());
            inserted_exchanges.push(exchange);
        }
        if inserted_ids.is_empty() {
            return 0;
        }

        let insert_at = self
            .blocks
            .iter()
            .position(|block| matches!(block, TranscriptBlock::Exchange(_)))
            .unwrap_or(self.blocks.len());
        self.blocks.splice(
            insert_at..insert_at,
            inserted_ids.iter().cloned().map(TranscriptBlock::Exchange),
        );
        self.exchanges.splice(0..0, inserted_exchanges);
        self.rebuild_exchange_indexes();
        inserted_ids.len()
    }

    pub fn push_notice(&mut self, speaker: &str, text: &str) -> String {
        self.notice_sequence = self.notice_sequence.saturating_add(1);
        let id = format!("notice:{}", self.notice_sequence);
        self.notice_index.insert(id.clone(), self.notices.len());
        self.notices.push(TranscriptNotice {
            id: id.clone(),
            speaker: speaker.to_string(),
            text: text.to_string(),
        });
        self.blocks.push(TranscriptBlock::Notice(id.clone()));
        id
    }

    pub fn update_notice(&mut self, id: &str, speaker: &str, text: &str) -> bool {
        let Some(index) = self.notice_index.get(id).copied() else {
            return false;
        };
        let Some(notice) = self.notices.get_mut(index) else {
            return false;
        };
        notice.speaker = speaker.to_string();
        notice.text = text.to_string();
        true
    }

    pub fn begin_exchange(
        &mut self,
        prompt: Option<String>,
        visibility: TranscriptPromptVisibility,
    ) -> String {
        self.pending_sequence = self.pending_sequence.saturating_add(1);
        let id = format!("pending:{}", self.pending_sequence);
        let exchange = TranscriptExchange {
            id: id.clone(),
            submission_id: id.clone(),
            prompt: prompt.map(|text| TranscriptPrompt {
                id: format!("{id}:prompt"),
                text,
                received_at: String::new(),
                visibility,
            }),
            activities: Vec::new(),
            assistant: None,
            status: TranscriptActivityStatus::Running,
        };
        self.blocks.push(TranscriptBlock::Exchange(id.clone()));
        self.exchanges.push(exchange);
        self.rebuild_exchange_indexes();
        id
    }

    pub fn bind_exchange(&mut self, exchange_id: &str, submission_id: &str) -> Option<String> {
        let submission_id = submission_id.trim();
        if submission_id.is_empty() {
            return None;
        }
        let source_index = self.exchange_index.get(exchange_id).copied()?;

        if let Some(target_index) = self.submission_index.get(submission_id).copied() {
            if target_index == source_index {
                return self
                    .exchanges
                    .get(source_index)
                    .map(|exchange| exchange.id.clone());
            }
            return self.merge_exchange_into(source_index, target_index);
        }

        let new_id = format!("exchange:{submission_id}");
        let old_id = self.exchanges[source_index].id.clone();
        let old_submission = self.exchanges[source_index].submission_id.clone();
        self.exchanges[source_index].id = new_id.clone();
        self.exchanges[source_index].submission_id = submission_id.to_string();
        for block in &mut self.blocks {
            if matches!(block, TranscriptBlock::Exchange(id) if id == &old_id) {
                *block = TranscriptBlock::Exchange(new_id.clone());
            }
        }
        if let Some(text) = self.streaming_text.remove(&old_submission) {
            self.streaming_text.insert(submission_id.to_string(), text);
        }
        if let Some(text) = self.pending_text.remove(&old_id) {
            self.pending_text.insert(new_id.clone(), text);
        }
        self.rebuild_exchange_indexes();
        Some(new_id)
    }

    pub fn set_pending_text(&mut self, exchange_id: &str, text: impl Into<String>) -> bool {
        if !self.exchange_index.contains_key(exchange_id) {
            return false;
        }
        self.pending_text
            .insert(exchange_id.to_string(), text.into());
        true
    }

    pub fn clear_pending_text(&mut self, exchange_id: &str) {
        self.pending_text.remove(exchange_id);
    }

    pub fn set_assistant(
        &mut self,
        exchange_id: &str,
        message_id: Option<String>,
        text: &str,
        completed_at: Option<String>,
    ) -> bool {
        let Some(index) = self.exchange_index.get(exchange_id).copied() else {
            return false;
        };
        let text = text.trim();
        if text.is_empty() {
            return false;
        }
        let exchange = &mut self.exchanges[index];
        exchange.assistant = Some(TranscriptAssistantMessage {
            id: message_id.unwrap_or_else(|| format!("{}:assistant:http", exchange.id)),
            text: text.to_string(),
            completed_at: completed_at.unwrap_or_default(),
        });
        exchange.status = TranscriptActivityStatus::Completed;
        self.streaming_text.remove(&exchange.submission_id);
        self.pending_text.remove(exchange_id);
        true
    }

    pub fn contains_submission(&self, submission_id: &str) -> bool {
        self.submission_index.contains_key(submission_id)
    }

    pub fn exchange_id_for_submission(&self, submission_id: &str) -> Option<&str> {
        let index = self.submission_index.get(submission_id)?;
        self.exchanges
            .get(*index)
            .map(|exchange| exchange.id.as_str())
    }

    pub fn apply_chunks(&mut self, chunks: &[ConversationChunk]) {
        for chunk in chunks {
            self.apply_chunk(chunk);
        }
    }

    pub fn apply_chunk(&mut self, chunk: &ConversationChunk) {
        if let Some(identity) = stable_chunk_identity(chunk) {
            if !self.seen_chunks.insert(identity) {
                return;
            }
        }
        if chunk.chunk_type == "conversation-reset" {
            self.apply_conversation_reset(&chunk.value);
            return;
        }
        let Some(submission_id) = chunk.submission_id().map(str::to_string) else {
            return;
        };
        if self.snapshot_submissions.contains(&submission_id) {
            return;
        }

        let exchange_id = self.ensure_live_exchange(&submission_id);
        match chunk.chunk_type.as_str() {
            "message-appended" => {
                if let Some(message) = chunk.value.get("message") {
                    self.apply_materialized_message(message);
                }
            }
            "message-started" => self.upsert_activity(
                &exchange_id,
                operation_activity(
                    &submission_id,
                    TranscriptActivityStatus::Running,
                    chunk.timestamp.clone(),
                    None,
                ),
            ),
            "message-delta" if chunk_kind(chunk) == Some("reasoning") => {
                self.append_reasoning(&exchange_id, &submission_id, chunk);
            }
            "message-delta" if chunk_kind(chunk) == Some("text") => {
                if let Some(delta) = chunk_delta(chunk) {
                    self.streaming_text
                        .entry(submission_id.clone())
                        .or_default()
                        .push_str(delta);
                }
            }
            "tool-input" => self.start_tool_activity(&exchange_id, &submission_id, chunk),
            "tool-output" | "tool-output-error" => {
                self.complete_tool_activity(&exchange_id, &submission_id, chunk);
            }
            "message-completed" => {
                self.complete_thinking_activities(&exchange_id, chunk.timestamp.clone());
                let text = self
                    .streaming_text
                    .get(&submission_id)
                    .cloned()
                    .unwrap_or_default();
                let _ = self.set_assistant(
                    &exchange_id,
                    chunk.message_id().map(|id| format!("assistant:{id}")),
                    &text,
                    chunk.timestamp.clone(),
                );
            }
            "submission-settled" => self.apply_settlement(&exchange_id, chunk),
            _ => {}
        }
        let exchange_is_terminal = self.exchange(&exchange_id).is_some_and(|exchange| {
            matches!(
                exchange.status,
                TranscriptActivityStatus::Completed | TranscriptActivityStatus::Failed
            )
        });
        if self.resumable_snapshot_submissions.contains(&submission_id) && exchange_is_terminal {
            self.resumable_snapshot_submissions.remove(&submission_id);
            self.snapshot_submissions.insert(submission_id);
        }
    }

    fn apply_conversation_reset(&mut self, value: &serde_json::Value) {
        let Some(snapshot) = value.get("snapshot") else {
            return;
        };
        if let Some(messages) = snapshot
            .get("messages")
            .and_then(serde_json::Value::as_array)
        {
            for message in messages {
                self.apply_materialized_message(message);
            }
        }
        if let Some(settlements) = snapshot
            .get("settlements")
            .and_then(serde_json::Value::as_array)
        {
            for settlement in settlements {
                let Some(submission_id) = settlement
                    .get("submissionId")
                    .and_then(serde_json::Value::as_str)
                else {
                    continue;
                };
                let exchange_id = self.ensure_live_exchange(submission_id);
                self.apply_settlement_value(&exchange_id, settlement, None);
            }
        }
    }

    fn apply_materialized_message(&mut self, message: &serde_json::Value) {
        if message.get("display").and_then(serde_json::Value::as_str) == Some("diagnostic") {
            self.apply_diagnostic_message(message);
            return;
        }
        if message.get("role").and_then(serde_json::Value::as_str) != Some("assistant")
            || message.get("purpose").and_then(serde_json::Value::as_str) != Some("assistant")
            || message.get("display").and_then(serde_json::Value::as_str) == Some("hidden")
        {
            return;
        }
        let Some(submission_id) = message
            .get("submissionId")
            .and_then(serde_json::Value::as_str)
        else {
            return;
        };
        let exchange_id = self.ensure_live_exchange(submission_id);
        let mut text = String::new();
        if let Some(parts) = message.get("parts").and_then(serde_json::Value::as_array) {
            for (index, part) in parts.iter().enumerate() {
                match part.get("type").and_then(serde_json::Value::as_str) {
                    Some("text") => append_materialized_text(&mut text, part),
                    Some("reasoning") => {
                        let preview = part
                            .get("text")
                            .and_then(serde_json::Value::as_str)
                            .unwrap_or_default();
                        self.upsert_activity(
                            &exchange_id,
                            TranscriptActivity {
                                id: format!("thinking:{submission_id}:snapshot:{index}"),
                                kind: TranscriptActivityKind::Thinking,
                                name: "thinking".to_string(),
                                status: part_state(part),
                                started_at: None,
                                completed_at: None,
                                duration_ms: None,
                                preview: (!preview.trim().is_empty())
                                    .then(|| bounded_text(preview, MAX_THINKING_PREVIEW_CHARS)),
                                error: None,
                            },
                        );
                    }
                    Some("dynamic-tool") => {
                        self.apply_materialized_tool(&exchange_id, submission_id, part)
                    }
                    _ => {}
                }
            }
        }
        if !text.trim().is_empty() {
            let _ = self.set_assistant(
                &exchange_id,
                message
                    .get("id")
                    .and_then(serde_json::Value::as_str)
                    .map(str::to_string),
                &text,
                None,
            );
        }
    }

    fn apply_diagnostic_message(&mut self, message: &serde_json::Value) {
        let Some(submission_id) = message
            .get("submissionId")
            .and_then(serde_json::Value::as_str)
        else {
            return;
        };
        let text = materialized_text(message);
        if text.trim().is_empty() {
            return;
        }
        let exchange_id = self.ensure_live_exchange(submission_id);
        let message_id = message
            .get("id")
            .and_then(serde_json::Value::as_str)
            .unwrap_or("diagnostic");
        self.upsert_activity(
            &exchange_id,
            TranscriptActivity {
                id: format!("log:{submission_id}:{message_id}"),
                kind: TranscriptActivityKind::Log,
                name: "diagnostic".to_string(),
                status: TranscriptActivityStatus::Completed,
                started_at: None,
                completed_at: None,
                duration_ms: None,
                preview: Some(text),
                error: None,
            },
        );
    }

    fn append_reasoning(
        &mut self,
        exchange_id: &str,
        submission_id: &str,
        chunk: &ConversationChunk,
    ) {
        let id = format!(
            "thinking:{submission_id}:{}",
            chunk.message_id().unwrap_or("current")
        );
        let current = self.activity(exchange_id, &id).cloned();
        let preview = bounded_text(
            &format!(
                "{}{}",
                current
                    .as_ref()
                    .and_then(|activity| activity.preview.as_deref())
                    .unwrap_or_default(),
                chunk_delta(chunk).unwrap_or_default(),
            ),
            MAX_THINKING_PREVIEW_CHARS,
        );
        self.upsert_activity(
            exchange_id,
            TranscriptActivity {
                id,
                kind: TranscriptActivityKind::Thinking,
                name: "thinking".to_string(),
                status: TranscriptActivityStatus::Running,
                started_at: current
                    .and_then(|activity| activity.started_at)
                    .or_else(|| chunk.timestamp.clone()),
                completed_at: None,
                duration_ms: None,
                preview: (!preview.is_empty()).then_some(preview),
                error: None,
            },
        );
    }

    fn start_tool_activity(
        &mut self,
        exchange_id: &str,
        submission_id: &str,
        chunk: &ConversationChunk,
    ) {
        let name = chunk
            .value
            .get("toolName")
            .and_then(serde_json::Value::as_str)
            .unwrap_or("tool");
        let display_name = if name == "task" {
            chunk
                .value
                .pointer("/input/agent")
                .and_then(serde_json::Value::as_str)
                .unwrap_or(name)
        } else {
            name
        };
        let tool_call_id = chunk.tool_call_id().unwrap_or("unknown");
        self.upsert_activity(
            exchange_id,
            TranscriptActivity {
                id: format!("tool:{submission_id}:{tool_call_id}"),
                kind: tool_activity_kind(name),
                name: display_name.to_string(),
                status: TranscriptActivityStatus::Running,
                started_at: chunk.timestamp.clone(),
                completed_at: None,
                duration_ms: None,
                preview: None,
                error: None,
            },
        );
    }

    fn complete_tool_activity(
        &mut self,
        exchange_id: &str,
        submission_id: &str,
        chunk: &ConversationChunk,
    ) {
        let id = format!(
            "tool:{submission_id}:{}",
            chunk.tool_call_id().unwrap_or("unknown")
        );
        let current = self.activity(exchange_id, &id).cloned();
        let failed = chunk.chunk_type == "tool-output-error";
        self.upsert_activity(
            exchange_id,
            TranscriptActivity {
                id,
                kind: current
                    .as_ref()
                    .map(|activity| activity.kind)
                    .unwrap_or(TranscriptActivityKind::Tool),
                name: current
                    .as_ref()
                    .map(|activity| activity.name.clone())
                    .unwrap_or_else(|| "tool".to_string()),
                status: if failed {
                    TranscriptActivityStatus::Failed
                } else {
                    TranscriptActivityStatus::Completed
                },
                started_at: current.and_then(|activity| activity.started_at),
                completed_at: chunk.timestamp.clone(),
                duration_ms: chunk
                    .value
                    .get("durationMs")
                    .and_then(serde_json::Value::as_u64),
                preview: None,
                error: failed.then(|| {
                    chunk
                        .value
                        .get("errorText")
                        .and_then(serde_json::Value::as_str)
                        .unwrap_or("Tool failed.")
                        .to_string()
                }),
            },
        );
    }

    fn apply_materialized_tool(
        &mut self,
        exchange_id: &str,
        submission_id: &str,
        part: &serde_json::Value,
    ) {
        let name = part
            .get("toolName")
            .and_then(serde_json::Value::as_str)
            .unwrap_or("tool");
        let tool_call_id = part
            .get("toolCallId")
            .and_then(serde_json::Value::as_str)
            .unwrap_or("unknown");
        let state = part.get("state").and_then(serde_json::Value::as_str);
        let failed = state == Some("output-error");
        self.upsert_activity(
            exchange_id,
            TranscriptActivity {
                id: format!("tool:{submission_id}:{tool_call_id}"),
                kind: tool_activity_kind(name),
                name: name.to_string(),
                status: match state {
                    Some("output-available") => TranscriptActivityStatus::Completed,
                    Some("output-error") => TranscriptActivityStatus::Failed,
                    _ => TranscriptActivityStatus::Running,
                },
                started_at: None,
                completed_at: None,
                duration_ms: part.get("durationMs").and_then(serde_json::Value::as_u64),
                preview: None,
                error: failed.then(|| {
                    part.get("errorText")
                        .and_then(serde_json::Value::as_str)
                        .unwrap_or("Tool failed.")
                        .to_string()
                }),
            },
        );
    }

    fn complete_thinking_activities(&mut self, exchange_id: &str, completed_at: Option<String>) {
        let Some(index) = self.exchange_index.get(exchange_id).copied() else {
            return;
        };
        for activity in &mut self.exchanges[index].activities {
            if activity.kind == TranscriptActivityKind::Thinking
                && activity.status == TranscriptActivityStatus::Running
            {
                activity.status = TranscriptActivityStatus::Completed;
                activity.completed_at = completed_at.clone();
            }
        }
    }

    fn apply_settlement(&mut self, exchange_id: &str, chunk: &ConversationChunk) {
        self.apply_settlement_value(exchange_id, &chunk.value, chunk.timestamp.clone());
    }

    fn apply_settlement_value(
        &mut self,
        exchange_id: &str,
        value: &serde_json::Value,
        completed_at: Option<String>,
    ) {
        let outcome = value
            .get("outcome")
            .and_then(serde_json::Value::as_str)
            .unwrap_or("failed");
        let failed = outcome != "completed";
        let submission_id = value
            .get("submissionId")
            .and_then(serde_json::Value::as_str)
            .unwrap_or("unknown");
        self.upsert_activity(
            exchange_id,
            operation_activity(
                submission_id,
                if failed {
                    TranscriptActivityStatus::Failed
                } else {
                    TranscriptActivityStatus::Completed
                },
                None,
                failed.then(|| settlement_error_text(value)),
            ),
        );
        if let Some(activity) = self
            .exchanges
            .get_mut(*self.exchange_index.get(exchange_id).unwrap())
            .and_then(|exchange| {
                exchange
                    .activities
                    .iter_mut()
                    .find(|activity| activity.id == format!("operation:{submission_id}"))
            })
        {
            activity.completed_at = completed_at;
        }
        self.set_exchange_terminal_status(exchange_id, failed);
    }

    pub fn lines(&self) -> Vec<TranscriptLine> {
        let mut lines = Vec::new();
        for block in &self.blocks {
            match block {
                TranscriptBlock::Notice(id) => {
                    let Some(notice) = self.notice(id) else {
                        continue;
                    };
                    append_speaker_lines(
                        &mut lines,
                        &notice.id,
                        &notice.speaker,
                        &notice.text,
                        notice_kind(&notice.speaker),
                        false,
                    );
                }
                TranscriptBlock::Exchange(id) => {
                    let Some(exchange) = self.exchange(id) else {
                        continue;
                    };
                    self.append_exchange_lines(exchange, &mut lines);
                }
            }
        }
        lines
    }

    pub fn exchanges(&self) -> &[TranscriptExchange] {
        &self.exchanges
    }

    pub fn first_exchange_line_id(&self) -> Option<String> {
        let exchange_id = self.blocks.iter().find_map(|block| match block {
            TranscriptBlock::Exchange(id) => Some(id),
            TranscriptBlock::Notice(_) => None,
        })?;
        let exchange = self.exchange(exchange_id)?;
        let mut lines = Vec::new();
        self.append_exchange_lines(exchange, &mut lines);
        lines.first().map(|line| line.id.clone())
    }

    fn append_snapshot(&mut self, exchanges: Vec<TranscriptExchange>) -> usize {
        let mut inserted = 0;
        for exchange in exchanges {
            if self.contains_exchange(&exchange.id, &exchange.submission_id) {
                continue;
            }
            self.track_snapshot_submission(&exchange);
            self.blocks
                .push(TranscriptBlock::Exchange(exchange.id.clone()));
            self.exchanges.push(exchange);
            inserted += 1;
        }
        self.rebuild_exchange_indexes();
        inserted
    }

    fn contains_exchange(&self, id: &str, submission_id: &str) -> bool {
        self.exchange_index.contains_key(id) || self.submission_index.contains_key(submission_id)
    }

    fn track_snapshot_submission(&mut self, exchange: &TranscriptExchange) {
        if matches!(
            exchange.status,
            TranscriptActivityStatus::Completed | TranscriptActivityStatus::Failed
        ) {
            self.snapshot_submissions
                .insert(exchange.submission_id.clone());
        } else {
            self.resumable_snapshot_submissions
                .insert(exchange.submission_id.clone());
        }
    }

    fn ensure_live_exchange(&mut self, submission_id: &str) -> String {
        if let Some(index) = self.submission_index.get(submission_id).copied() {
            return self.exchanges[index].id.clone();
        }
        let id = format!("exchange:{submission_id}");
        self.exchanges.push(TranscriptExchange {
            id: id.clone(),
            submission_id: submission_id.to_string(),
            prompt: None,
            activities: Vec::new(),
            assistant: None,
            status: TranscriptActivityStatus::Running,
        });
        self.blocks.push(TranscriptBlock::Exchange(id.clone()));
        self.rebuild_exchange_indexes();
        id
    }

    fn merge_exchange_into(&mut self, source_index: usize, target_index: usize) -> Option<String> {
        let source = self.exchanges.get(source_index)?.clone();
        let target_id = self.exchanges.get(target_index)?.id.clone();
        if self.exchanges[target_index].prompt.is_none() {
            self.exchanges[target_index].prompt = source.prompt;
        }
        let source_id = source.id;
        self.blocks
            .retain(|block| !matches!(block, TranscriptBlock::Exchange(id) if id == &source_id));
        self.exchanges.remove(source_index);
        self.pending_text.remove(&source_id);
        self.rebuild_exchange_indexes();
        Some(target_id)
    }

    fn rebuild_exchange_indexes(&mut self) {
        self.exchange_index.clear();
        self.submission_index.clear();
        for (index, exchange) in self.exchanges.iter().enumerate() {
            self.exchange_index.insert(exchange.id.clone(), index);
            self.submission_index
                .insert(exchange.submission_id.clone(), index);
        }
    }

    fn exchange(&self, id: &str) -> Option<&TranscriptExchange> {
        self.exchange_index
            .get(id)
            .and_then(|index| self.exchanges.get(*index))
    }

    fn notice(&self, id: &str) -> Option<&TranscriptNotice> {
        self.notice_index
            .get(id)
            .and_then(|index| self.notices.get(*index))
    }

    fn append_exchange_lines(
        &self,
        exchange: &TranscriptExchange,
        lines: &mut Vec<TranscriptLine>,
    ) {
        if let Some(prompt) = exchange
            .prompt
            .as_ref()
            .filter(|prompt| prompt.visibility == TranscriptPromptVisibility::User)
            .filter(|prompt| !prompt.text.trim().is_empty())
        {
            append_speaker_lines(
                lines,
                &prompt.id,
                "you",
                &prompt.text,
                TranscriptLineKind::User,
                false,
            );
        }

        for activity in &exchange.activities {
            let (kind, text) = format_activity(activity);
            append_plain_lines(lines, &activity.id, &text, kind, false);
        }

        if let Some(assistant) = exchange
            .assistant
            .as_ref()
            .filter(|assistant| !assistant.text.trim().is_empty())
        {
            append_speaker_lines(
                lines,
                &assistant.id,
                "assistant",
                &assistant.text,
                TranscriptLineKind::Assistant,
                false,
            );
            return;
        }

        if let Some(text) = self
            .streaming_text
            .get(&exchange.submission_id)
            .filter(|text| !text.is_empty())
        {
            append_speaker_lines(
                lines,
                &format!("{}:stream", exchange.id),
                "assistant",
                text,
                TranscriptLineKind::Assistant,
                true,
            );
            return;
        }

        if let Some(text) = self
            .pending_text
            .get(&exchange.id)
            .filter(|text| !text.is_empty())
        {
            append_plain_lines(
                lines,
                &format!("{}:pending", exchange.id),
                text,
                TranscriptLineKind::Assistant,
                true,
            );
        }
    }

    fn activity(&self, exchange_id: &str, activity_id: &str) -> Option<&TranscriptActivity> {
        self.exchange(exchange_id)?
            .activities
            .iter()
            .find(|activity| activity.id == activity_id)
    }

    fn upsert_activity(&mut self, exchange_id: &str, activity: TranscriptActivity) {
        let Some(index) = self.exchange_index.get(exchange_id).copied() else {
            return;
        };
        let activities = &mut self.exchanges[index].activities;
        if let Some(existing) = activities
            .iter_mut()
            .find(|existing| existing.id == activity.id)
        {
            let started_at = activity
                .started_at
                .clone()
                .or_else(|| existing.started_at.clone());
            *existing = activity;
            existing.started_at = started_at;
        } else {
            activities.push(activity);
        }
    }

    fn set_exchange_terminal_status(&mut self, exchange_id: &str, failed: bool) {
        let Some(index) = self.exchange_index.get(exchange_id).copied() else {
            return;
        };
        if failed {
            self.exchanges[index].status = TranscriptActivityStatus::Failed;
        } else if self.exchanges[index].status != TranscriptActivityStatus::Failed {
            self.exchanges[index].status = TranscriptActivityStatus::Completed;
        }
    }
}

pub fn format_event_duration(duration_ms: u64) -> String {
    if duration_ms < 1_000 {
        return format!("{duration_ms}ms");
    }
    if duration_ms < 60_000 {
        let seconds = duration_ms as f64 / 1_000.0;
        if duration_ms.is_multiple_of(1_000) {
            return format!("{}s", duration_ms / 1_000);
        }
        return format!("{seconds:.1}s");
    }

    let total_seconds = duration_ms / 1_000;
    if total_seconds < 3_600 {
        return format!("{}m {:02}s", total_seconds / 60, total_seconds % 60);
    }
    format!(
        "{}h {:02}m",
        total_seconds / 3_600,
        (total_seconds % 3_600) / 60
    )
}

fn format_activity(activity: &TranscriptActivity) -> (TranscriptLineKind, String) {
    let failed = activity.status == TranscriptActivityStatus::Failed;
    let kind = if failed {
        TranscriptLineKind::Error
    } else {
        match activity.kind {
            TranscriptActivityKind::Operation => TranscriptLineKind::Operation,
            TranscriptActivityKind::Thinking => TranscriptLineKind::Thinking,
            TranscriptActivityKind::Tool => TranscriptLineKind::Tool,
            TranscriptActivityKind::Task => TranscriptLineKind::Task,
            TranscriptActivityKind::Log => TranscriptLineKind::Log,
            TranscriptActivityKind::Unknown => TranscriptLineKind::Other,
        }
    };

    if activity.kind == TranscriptActivityKind::Thinking {
        let preview = activity.preview.as_deref().unwrap_or_default().trim();
        return (
            kind,
            if preview.is_empty() {
                match activity.status {
                    TranscriptActivityStatus::Running => "thinking: started".to_string(),
                    TranscriptActivityStatus::Completed => "thinking: done".to_string(),
                    TranscriptActivityStatus::Failed => "thinking: failed".to_string(),
                    TranscriptActivityStatus::Unknown => "thinking: status unknown".to_string(),
                }
            } else {
                format!("thinking: {preview}")
            },
        );
    }

    if activity.kind == TranscriptActivityKind::Log {
        return (
            kind,
            format!(
                "log: {}",
                activity
                    .preview
                    .as_deref()
                    .or(activity.error.as_deref())
                    .unwrap_or(&activity.name)
            ),
        );
    }

    let prefix = match activity.kind {
        TranscriptActivityKind::Operation => "operation",
        TranscriptActivityKind::Tool => "tool",
        TranscriptActivityKind::Task => "task",
        TranscriptActivityKind::Thinking | TranscriptActivityKind::Log => unreachable!(),
        TranscriptActivityKind::Unknown => "activity",
    };
    let status = match activity.status {
        TranscriptActivityStatus::Running => "running",
        TranscriptActivityStatus::Completed => "completed",
        TranscriptActivityStatus::Failed => "failed",
        TranscriptActivityStatus::Unknown => "status unknown",
    };
    let duration = activity
        .duration_ms
        .map(format_event_duration)
        .map(|duration| format!(" in {duration}"))
        .unwrap_or_default();
    let error = activity
        .error
        .as_deref()
        .filter(|error| !error.trim().is_empty())
        .map(|error| format!(" - {}", error.trim()))
        .unwrap_or_default();
    (
        kind,
        format!("{prefix}: {} {status}{duration}{error}", activity.name),
    )
}

fn append_speaker_lines(
    lines: &mut Vec<TranscriptLine>,
    id: &str,
    speaker: &str,
    text: &str,
    kind: TranscriptLineKind,
    is_streaming: bool,
) {
    let mut split = text.lines();
    let first = split.next().unwrap_or_default();
    lines.push(TranscriptLine {
        id: format!("{id}:0"),
        text: if first.is_empty() {
            format!("{speaker}:")
        } else {
            format!("{speaker}: {first}")
        },
        kind,
        is_streaming,
    });
    for (index, line) in split.enumerate() {
        lines.push(TranscriptLine {
            id: format!("{id}:{}", index + 1),
            text: format!("  {line}"),
            kind,
            is_streaming,
        });
    }
}

fn append_plain_lines(
    lines: &mut Vec<TranscriptLine>,
    id: &str,
    text: &str,
    kind: TranscriptLineKind,
    is_streaming: bool,
) {
    for (index, line) in text.lines().enumerate() {
        lines.push(TranscriptLine {
            id: format!("{id}:{index}"),
            text: line.to_string(),
            kind,
            is_streaming,
        });
    }
}

fn notice_kind(speaker: &str) -> TranscriptLineKind {
    match speaker {
        "system" => TranscriptLineKind::System,
        "preflight" => TranscriptLineKind::Preflight,
        "error" => TranscriptLineKind::Error,
        "assistant" => TranscriptLineKind::Assistant,
        "you" => TranscriptLineKind::User,
        _ => TranscriptLineKind::Other,
    }
}

fn stable_chunk_identity(chunk: &ConversationChunk) -> Option<String> {
    let position = chunk.position?;
    let conversation_id = chunk
        .value
        .get("conversationId")
        .and_then(serde_json::Value::as_str)?;
    Some(format!(
        "{conversation_id}:{}:{}",
        position.batch, position.index
    ))
}

fn chunk_kind(chunk: &ConversationChunk) -> Option<&str> {
    chunk.value.get("kind").and_then(serde_json::Value::as_str)
}

fn chunk_delta(chunk: &ConversationChunk) -> Option<&str> {
    chunk.value.get("delta").and_then(serde_json::Value::as_str)
}

fn tool_activity_kind(name: &str) -> TranscriptActivityKind {
    if name == "task" {
        TranscriptActivityKind::Task
    } else {
        TranscriptActivityKind::Tool
    }
}

fn operation_activity(
    submission_id: &str,
    status: TranscriptActivityStatus,
    started_at: Option<String>,
    error: Option<String>,
) -> TranscriptActivity {
    TranscriptActivity {
        id: format!("operation:{submission_id}"),
        kind: TranscriptActivityKind::Operation,
        name: "operation".to_string(),
        status,
        started_at,
        completed_at: None,
        duration_ms: None,
        preview: None,
        error,
    }
}

fn append_materialized_text(output: &mut String, part: &serde_json::Value) {
    let Some(text) = part.get("text").and_then(serde_json::Value::as_str) else {
        return;
    };
    if !output.is_empty() {
        output.push_str("\n\n");
    }
    output.push_str(text);
}

fn materialized_text(message: &serde_json::Value) -> String {
    let mut output = String::new();
    if let Some(parts) = message.get("parts").and_then(serde_json::Value::as_array) {
        for part in parts {
            if part.get("type").and_then(serde_json::Value::as_str) == Some("text") {
                append_materialized_text(&mut output, part);
            }
        }
    }
    output
}

fn part_state(part: &serde_json::Value) -> TranscriptActivityStatus {
    if part.get("state").and_then(serde_json::Value::as_str) == Some("done") {
        TranscriptActivityStatus::Completed
    } else {
        TranscriptActivityStatus::Running
    }
}

fn settlement_error_text(value: &serde_json::Value) -> String {
    value
        .get("error")
        .and_then(|error| {
            error
                .as_str()
                .or_else(|| error.get("message").and_then(serde_json::Value::as_str))
        })
        .unwrap_or("Operation failed.")
        .to_string()
}

fn bounded_text(value: &str, limit: usize) -> String {
    let characters = value.chars().collect::<Vec<_>>();
    if characters.len() <= limit {
        return value.to_string();
    }
    let keep = limit.saturating_sub(3);
    format!("{}...", characters[..keep].iter().collect::<String>())
}
