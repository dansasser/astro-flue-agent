import { Box } from 'ink';
import React from 'react';
import type { FlueConversationMessage } from '@flue/react';
import { MessageView } from './MessageView.js';

export interface MessageListProps {
  messages: FlueConversationMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1} overflowY="hidden">
      {messages.filter((message) => message.display !== 'hidden').map((message) => (
        <MessageView key={message.id} message={message} />
      ))}
    </Box>
  );
}
