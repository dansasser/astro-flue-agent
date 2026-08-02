use sim_one_ratatui_tui::history::{
    TranscriptActivity, TranscriptActivityKind, TranscriptActivityStatus,
    TranscriptAssistantMessage, TranscriptExchange, TranscriptPrompt, TranscriptPromptVisibility,
};
use sim_one_ratatui_tui::transcript::{
    format_event_duration, TranscriptDocument, TranscriptLineKind,
};

mod support;
use support::chunk;

#[test]
fn event_duration_format_is_stable_across_millisecond_to_hour_ranges() {
    assert_eq!(format_event_duration(13), "13ms");
    assert_eq!(format_event_duration(5_900), "5.9s");
    assert_eq!(format_event_duration(72_000), "1m 12s");
    assert_eq!(format_event_duration(3_720_000), "1h 02m");
}

#[test]
fn transcript_document_renders_snapshot_prompt_activity_and_final_in_order() {
    let mut document = TranscriptDocument::default();
    document.install_snapshot(vec![TranscriptExchange {
        id: "submission:snapshot".to_string(),
        submission_id: "snapshot".to_string(),
        prompt: Some(TranscriptPrompt {
            id: "prompt:snapshot".to_string(),
            text: "Summarize the release\nand include risks.".to_string(),
            received_at: "2026-07-23T10:00:00Z".to_string(),
            visibility: TranscriptPromptVisibility::User,
        }),
        activities: vec![TranscriptActivity {
            id: "snapshot:operation:root".to_string(),
            kind: TranscriptActivityKind::Operation,
            name: "orchestrate".to_string(),
            status: TranscriptActivityStatus::Completed,
            started_at: Some("2026-07-23T10:00:01Z".to_string()),
            completed_at: Some("2026-07-23T10:00:07Z".to_string()),
            duration_ms: Some(5_900),
            preview: None,
            error: None,
        }],
        assistant: Some(TranscriptAssistantMessage {
            id: "snapshot:message:9".to_string(),
            text: "Release summary\n\n- Risk one".to_string(),
            completed_at: "2026-07-23T10:00:08Z".to_string(),
        }),
        status: TranscriptActivityStatus::Completed,
    }]);

    let lines = document.lines();
    let texts = lines
        .iter()
        .map(|line| line.text.as_str())
        .collect::<Vec<_>>();
    assert_eq!(
        texts,
        [
            "you: Summarize the release",
            "  and include risks.",
            "operation: orchestrate completed in 5.9s",
            "assistant: Release summary",
            "  ",
            "  - Risk one",
        ]
    );
    assert_eq!(lines[2].kind, TranscriptLineKind::Operation);
    assert_eq!(lines[3].kind, TranscriptLineKind::Assistant);
}

#[test]
fn transcript_document_hides_internal_prompt_but_keeps_its_greeting() {
    let mut document = TranscriptDocument::default();
    document.install_snapshot(vec![TranscriptExchange {
        id: "submission:greeting".to_string(),
        submission_id: "greeting".to_string(),
        prompt: Some(TranscriptPrompt {
            id: "prompt:greeting".to_string(),
            text: "INTERNAL_STARTUP_SENTINEL".to_string(),
            received_at: "2026-07-23T10:00:00Z".to_string(),
            visibility: TranscriptPromptVisibility::Internal,
        }),
        activities: Vec::new(),
        assistant: Some(TranscriptAssistantMessage {
            id: "greeting:message:4".to_string(),
            text: "Hello Daniel. All systems go.".to_string(),
            completed_at: "2026-07-23T10:00:02Z".to_string(),
        }),
        status: TranscriptActivityStatus::Completed,
    }]);

    let transcript = rendered(&document);
    assert!(!transcript.contains("INTERNAL_STARTUP_SENTINEL"));
    assert!(transcript.contains("assistant: Hello Daniel. All systems go."));
}

#[test]
fn live_chunks_render_reasoning_tools_final_text_and_settlement_in_order() {
    let mut document = TranscriptDocument::default();
    document.apply_chunks(&[
        message_started("submission-a", "message-a"),
        reasoning_delta("submission-a", "message-a", "checking protocol"),
        tool_input("submission-a", "message-a", "tool-a", "load_protocols"),
        tool_output("submission-a", "tool-a", 13),
        text_delta("submission-a", "message-a", "Release ready."),
        message_completed("submission-a", "message-a"),
        settlement("submission-a", "completed"),
    ]);

    let transcript = rendered(&document);
    assert!(transcript.contains("thinking: checking protocol"));
    assert!(transcript.contains("tool: load_protocols completed in 13ms"));
    assert!(transcript.contains("operation: operation completed"));
    assert!(transcript.contains("assistant: Release ready."));
    assert_eq!(document.exchanges().len(), 1);
}

#[test]
fn repeated_transport_delivery_is_deduped_by_chunk_position() {
    let mut document = TranscriptDocument::default();
    let chunks = vec![
        message_started("submission-replay", "message-replay"),
        text_delta("submission-replay", "message-replay", "only once"),
        message_completed("submission-replay", "message-replay"),
        settlement("submission-replay", "completed"),
    ];

    document.apply_chunks(&chunks);
    document.apply_chunks(&chunks);

    let transcript = rendered(&document);
    assert_eq!(transcript.matches("assistant: only once").count(), 1);
    assert_eq!(document.exchanges().len(), 1);
}

#[test]
fn fresh_reset_materializes_visible_history_and_settlements() {
    let mut document = TranscriptDocument::default();
    document.apply_chunks(&[chunk(serde_json::json!({
        "type":"conversation-reset",
        "conversationId":"conversation-reset",
        "snapshot":{
            "v":1,
            "offset":"0000000000000002_0000000000000000",
            "messages":[{
                "id":"message-history",
                "role":"assistant",
                "purpose":"assistant",
                "display":"visible",
                "submissionId":"submission-history",
                "parts":[
                    {"type":"reasoning","text":"checked history","state":"done"},
                    {"type":"text","text":"Historical answer.","state":"done"}
                ]
            }],
            "settlements":[{
                "submissionId":"submission-history",
                "outcome":"completed"
            }]
        }
    }))]);

    let transcript = rendered(&document);
    assert!(transcript.contains("thinking: checked history"));
    assert!(transcript.contains("assistant: Historical answer."));
    assert!(transcript.contains("operation: operation completed"));
}

#[test]
fn failed_tool_and_submission_remain_failed() {
    let mut document = TranscriptDocument::default();
    document.apply_chunks(&[
        message_started("submission-failed", "message-failed"),
        tool_input(
            "submission-failed",
            "message-failed",
            "tool-failed",
            "write_file",
        ),
        chunk(serde_json::json!({
            "type":"tool-output-error",
            "conversationId":"conversation-failed",
            "submissionId":"submission-failed",
            "toolCallId":"tool-failed",
            "errorText":"permission denied",
            "durationMs":21
        })),
        chunk(serde_json::json!({
            "type":"submission-settled",
            "conversationId":"conversation-failed",
            "submissionId":"submission-failed",
            "outcome":"failed",
            "error":{"message":"model failed"}
        })),
    ]);

    let transcript = rendered(&document);
    assert!(transcript.contains("tool: write_file failed in 21ms - permission denied"));
    assert!(transcript.contains("operation: operation failed - model failed"));
    assert_eq!(
        document.exchanges()[0].status,
        TranscriptActivityStatus::Failed
    );
}

#[test]
fn separate_submissions_with_same_message_text_preserve_history() {
    let mut document = TranscriptDocument::default();
    for (submission_id, message_id) in [
        ("submission-first", "message-first"),
        ("submission-second", "message-second"),
    ] {
        document.apply_chunks(&[
            message_started(submission_id, message_id),
            text_delta(submission_id, message_id, "same answer"),
            message_completed(submission_id, message_id),
            settlement(submission_id, "completed"),
        ]);
    }

    let transcript = rendered(&document);
    assert_eq!(transcript.matches("assistant: same answer").count(), 2);
    assert_eq!(document.exchanges().len(), 2);
}

fn rendered(document: &TranscriptDocument) -> String {
    document
        .lines()
        .into_iter()
        .map(|line| line.text)
        .collect::<Vec<_>>()
        .join("\n")
}

fn message_started(
    submission_id: &str,
    message_id: &str,
) -> sim_one_ratatui_tui::flue::events::ConversationChunk {
    chunk(serde_json::json!({
        "type":"message-started",
        "conversationId":"conversation-live",
        "messageId":message_id,
        "submissionId":submission_id,
        "timestamp":"2026-08-01T12:00:00Z"
    }))
}

fn reasoning_delta(
    submission_id: &str,
    message_id: &str,
    delta: &str,
) -> sim_one_ratatui_tui::flue::events::ConversationChunk {
    chunk(serde_json::json!({
        "type":"message-delta",
        "conversationId":"conversation-live",
        "messageId":message_id,
        "submissionId":submission_id,
        "kind":"reasoning",
        "delta":delta
    }))
}

fn text_delta(
    submission_id: &str,
    message_id: &str,
    delta: &str,
) -> sim_one_ratatui_tui::flue::events::ConversationChunk {
    chunk(serde_json::json!({
        "type":"message-delta",
        "conversationId":"conversation-live",
        "messageId":message_id,
        "submissionId":submission_id,
        "kind":"text",
        "delta":delta
    }))
}

fn tool_input(
    submission_id: &str,
    message_id: &str,
    tool_call_id: &str,
    tool_name: &str,
) -> sim_one_ratatui_tui::flue::events::ConversationChunk {
    chunk(serde_json::json!({
        "type":"tool-input",
        "conversationId":"conversation-live",
        "messageId":message_id,
        "submissionId":submission_id,
        "toolCallId":tool_call_id,
        "toolName":tool_name,
        "input":{}
    }))
}

fn tool_output(
    submission_id: &str,
    tool_call_id: &str,
    duration_ms: u64,
) -> sim_one_ratatui_tui::flue::events::ConversationChunk {
    chunk(serde_json::json!({
        "type":"tool-output",
        "conversationId":"conversation-live",
        "submissionId":submission_id,
        "toolCallId":tool_call_id,
        "output":{},
        "durationMs":duration_ms
    }))
}

fn message_completed(
    submission_id: &str,
    message_id: &str,
) -> sim_one_ratatui_tui::flue::events::ConversationChunk {
    chunk(serde_json::json!({
        "type":"message-completed",
        "conversationId":"conversation-live",
        "messageId":message_id,
        "submissionId":submission_id,
        "timestamp":"2026-08-01T12:00:01Z"
    }))
}

fn settlement(
    submission_id: &str,
    outcome: &str,
) -> sim_one_ratatui_tui::flue::events::ConversationChunk {
    chunk(serde_json::json!({
        "type":"submission-settled",
        "conversationId":"conversation-live",
        "submissionId":submission_id,
        "outcome":outcome,
        "timestamp":"2026-08-01T12:00:02Z"
    }))
}
