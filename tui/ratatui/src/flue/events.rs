#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct StreamPosition {
    pub batch: u64,
    pub index: u64,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ConversationChunk {
    pub chunk_type: String,
    pub position: Option<StreamPosition>,
    pub timestamp: Option<String>,
    pub value: serde_json::Value,
}

impl ConversationChunk {
    pub fn from_value(value: serde_json::Value) -> Self {
        let chunk_type = value
            .get("type")
            .and_then(serde_json::Value::as_str)
            .unwrap_or("unknown")
            .to_string();
        let position = value
            .get("position")
            .and_then(serde_json::Value::as_object)
            .and_then(|position| {
                Some(StreamPosition {
                    batch: position.get("batch")?.as_u64()?,
                    index: position.get("index")?.as_u64()?,
                })
            });
        let timestamp = value
            .get("timestamp")
            .and_then(serde_json::Value::as_str)
            .map(str::to_string);

        Self {
            chunk_type,
            position,
            timestamp,
            value,
        }
    }

    pub fn submission_id(&self) -> Option<&str> {
        self.value
            .get("submissionId")
            .and_then(serde_json::Value::as_str)
            .or_else(|| {
                self.value
                    .pointer("/message/submissionId")
                    .and_then(serde_json::Value::as_str)
            })
    }

    pub fn message_id(&self) -> Option<&str> {
        self.value
            .get("messageId")
            .and_then(serde_json::Value::as_str)
            .or_else(|| {
                self.value
                    .pointer("/message/id")
                    .and_then(serde_json::Value::as_str)
            })
    }

    pub fn tool_call_id(&self) -> Option<&str> {
        self.value
            .get("toolCallId")
            .and_then(serde_json::Value::as_str)
    }
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct StreamControl {
    pub stream_next_offset: Option<String>,
    pub up_to_date: bool,
}

impl StreamControl {
    pub fn from_value(value: &serde_json::Value) -> Self {
        Self {
            stream_next_offset: value
                .get("streamNextOffset")
                .and_then(serde_json::Value::as_str)
                .map(str::to_string),
            up_to_date: value
                .get("upToDate")
                .and_then(serde_json::Value::as_bool)
                .unwrap_or(false),
        }
    }
}
