use std::sync::atomic::{AtomicU64, Ordering};

use sim_one_ratatui_tui::flue::events::ConversationChunk;

static NEXT_BATCH: AtomicU64 = AtomicU64::new(1);

pub fn chunk(mut value: serde_json::Value) -> ConversationChunk {
    let object = value
        .as_object_mut()
        .expect("conversation chunk fixture must be an object");
    let batch = object
        .remove("batch")
        .and_then(|value| value.as_u64())
        .unwrap_or_else(|| NEXT_BATCH.fetch_add(1, Ordering::Relaxed));
    let chunk_type = object
        .get("type")
        .and_then(serde_json::Value::as_str)
        .unwrap_or("unknown")
        .to_string();
    let default_submission_id = if chunk_type == "message-appended" {
        format!("fixture-submission-{batch}")
    } else {
        "fixture-submission".to_string()
    };
    let default_message_id = if chunk_type == "message-appended" {
        format!("fixture-message-{batch}")
    } else {
        "fixture-message".to_string()
    };
    let submission_id = object
        .get("submissionId")
        .and_then(serde_json::Value::as_str)
        .map(str::to_string)
        .unwrap_or(default_submission_id);
    let message_id = object
        .get("messageId")
        .and_then(serde_json::Value::as_str)
        .map(str::to_string)
        .unwrap_or(default_message_id);
    object
        .entry("conversationId")
        .or_insert_with(|| serde_json::json!("fixture-conversation"));
    object
        .entry("position")
        .or_insert_with(|| serde_json::json!({ "batch": batch, "index": 0 }));

    match chunk_type.as_str() {
        "message-started" => {
            object.insert("submissionId".to_string(), serde_json::json!(submission_id));
            object.insert("messageId".to_string(), serde_json::json!(message_id));
        }
        "message-delta" => {
            let delta = object
                .remove("delta")
                .or_else(|| object.remove("text"))
                .unwrap_or_else(|| serde_json::json!(""));
            object.insert("submissionId".to_string(), serde_json::json!(submission_id));
            object.insert("messageId".to_string(), serde_json::json!(message_id));
            object.insert("delta".to_string(), delta);
        }
        "tool-input" => {
            object.insert("submissionId".to_string(), serde_json::json!(submission_id));
            object.insert("messageId".to_string(), serde_json::json!(message_id));
            object.entry("input").or_insert(serde_json::Value::Null);
        }
        "tool-output" | "tool-output-error" => {
            object.insert("submissionId".to_string(), serde_json::json!(submission_id));
            object.entry("output").or_insert(serde_json::Value::Null);
        }
        "submission-settled" => {
            let failed = object
                .remove("isError")
                .and_then(|value| value.as_bool())
                .unwrap_or(false);
            object.insert("submissionId".to_string(), serde_json::json!(submission_id));
            object
                .entry("outcome")
                .or_insert_with(|| serde_json::json!(if failed { "failed" } else { "completed" }));
        }
        "message-appended" => {
            let text = object
                .remove("text")
                .and_then(|value| value.as_str().map(str::to_string));
            let mut message = object.remove("message").unwrap_or_else(|| {
                serde_json::json!({
                    "role":"system",
                    "purpose":"advisory",
                    "display":"diagnostic",
                    "parts":[{"type":"text","text":text.unwrap_or_default(),"state":"done"}]
                })
            });
            normalize_message(&mut message, &submission_id, &message_id);
            object.insert("submissionId".to_string(), serde_json::json!(submission_id));
            object.insert("message".to_string(), message);
        }
        _ => {}
    }

    ConversationChunk::from_value(value)
}

fn normalize_message(message: &mut serde_json::Value, submission_id: &str, message_id: &str) {
    let message = message
        .as_object_mut()
        .expect("materialized message fixture must be an object");
    message
        .entry("id")
        .or_insert_with(|| serde_json::json!(message_id));
    message
        .entry("role")
        .or_insert_with(|| serde_json::json!("assistant"));
    message
        .entry("purpose")
        .or_insert_with(|| serde_json::json!("assistant"));
    message
        .entry("display")
        .or_insert_with(|| serde_json::json!("visible"));
    message.insert("submissionId".to_string(), serde_json::json!(submission_id));
    if message.contains_key("parts") {
        return;
    }

    let content = message.remove("content").unwrap_or_default();
    let text = match content {
        serde_json::Value::String(text) => text,
        serde_json::Value::Array(parts) => parts
            .iter()
            .filter_map(|part| part.get("text").and_then(serde_json::Value::as_str))
            .collect::<Vec<_>>()
            .join(""),
        _ => String::new(),
    };
    message.insert(
        "parts".to_string(),
        serde_json::json!([{"type":"text","text":text,"state":"done"}]),
    );
}
