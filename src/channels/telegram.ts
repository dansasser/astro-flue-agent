import {
  dispatch,
  init,
  type AgentReply,
  type DispatchReceipt,
} from '@flue/runtime';
import { createTelegramChannel, type TelegramConversationRef } from '@flue/telegram';
import type { Message, Update } from 'grammy/types';
import { Orchestrator } from '../agents/orchestrator.js';
import {
  createApprovalIngress,
  createFileApprovalBindingStore,
} from '../api/ingress/approval-ingress.js';
import { createSharedCodingApprovalService } from '../engine/approvals/shared-approval-service.js';
import { goromboPersistenceRuntime } from '../db.js';
import { resolveChatSession } from '../engine/session/session-routing.js';
import { renderContinuationContext } from '../engine/session/continuation-context.js';
import { agentConversationUrl } from '../engine/session/flue-conversation.js';
import type { NormalizedMessageEvent } from '../core/types/index.js';
import { createChatPrompt } from '../api/routes/chat-prompt.js';
import { normalizeTelegramUpdate } from '../api/connectors/telegram/telegram.js';
import { buildApprovalResolvedMessage, parseApprovalCallback } from '../api/connectors/telegram/approval-ui/index.js';
import { markTelegramUpdateReceived } from '../api/connectors/telegram/telegram-state.js';
import { isMentioned } from '../api/connectors/telegram/telegram-api.js';
import { client } from './telegram-client.js';

function isTestMode(): boolean {
  return process.env.NODE_ENV === 'test' || process.env.GOROMBO_TEST_MODE === '1';
}

function isTelegramConfigured(): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  return (typeof token === 'string' && token.trim().length > 0) || isTestMode();
}

type DmPolicy = 'disabled' | 'allowlist' | 'pairing';

function resolveEffectiveDmPolicy(): DmPolicy {
  const stored = goromboPersistenceRuntime.sessionDatabase.getTelegramSetting('dmPolicy');
  if (stored === 'disabled' || stored === 'allowlist' || stored === 'pairing') {
    return stored;
  }
  return 'pairing';
}

function getApprovedUserIds(): string[] {
  const raw = process.env.TELEGRAM_APPROVED_USER_IDS;
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return [];
  }
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function getBotUsername(): string {
  return process.env.TELEGRAM_BOT_USERNAME ?? '';
}

function getMentionPatterns(): string[] {
  const raw = process.env.TELEGRAM_MENTION_PATTERNS;
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return [];
  }
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function shouldProcessUpdate(message: Message): { allowed: true } | { allowed: false; reason: string } {
  const chatType = message.chat.type;
  const chatId = String(message.chat.id);
  const senderId = String(message.from?.id ?? '');

  const dmPolicy = resolveEffectiveDmPolicy();

  if (dmPolicy === 'disabled') {
    return { allowed: false, reason: 'dm_policy_disabled' };
  }

  const approvedUserIds = getApprovedUserIds();
  const isAllowed =
    goromboPersistenceRuntime.sessionDatabase.isTelegramUserAllowed(senderId) ||
    approvedUserIds.includes(senderId);

  if (chatType === 'private') {
    if (!isAllowed) {
      if (dmPolicy === 'allowlist') {
        return { allowed: false, reason: 'dm_allowlist' };
      }
      return { allowed: false, reason: 'dm_pairing_required' };
    }
  } else if (chatType === 'group' || chatType === 'supergroup') {
    const group = goromboPersistenceRuntime.sessionDatabase.getTelegramGroup(chatId);
    if (!group) {
      return { allowed: false, reason: 'group_not_configured' };
    }

    const botUsername = getBotUsername();
    const mentionPatterns = getMentionPatterns();
    if (group.requireMention && !isMentioned(message, botUsername, mentionPatterns)) {
      return { allowed: false, reason: 'group_mention_required' };
    }

    if (group.allowFrom.length > 0 && !group.allowFrom.includes(senderId)) {
      return { allowed: false, reason: 'group_allowlist' };
    }

    if (!isAllowed) {
      return { allowed: false, reason: 'user_not_allowed' };
    }
  } else {
    return { allowed: false, reason: 'unsupported_chat_type' };
  }

  return { allowed: true };
}

import type { TelegramChannel } from '@flue/telegram';

function getTelegramWebhookSecret(): string {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN;
  if (secret) {
    return secret;
  }
  if (isTestMode()) {
    return 'test-webhook-secret';
  }
  if (isTelegramConfigured()) {
    throw new Error(
      'TELEGRAM_WEBHOOK_SECRET_TOKEN environment variable is required for webhook authentication when Telegram is configured. Set it to enable Telegram, or remove TELEGRAM_BOT_TOKEN to run without Telegram (TUI/HTTP only).',
    );
  }
  // Telegram not configured: use a random non-deterministic secret so
  // the channel can still be constructed (Flue requires it) but webhook
  // requests will never authenticate even if they reach this instance.
  return `disabled-${crypto.randomUUID()}`;
}

let cachedChannel: TelegramChannel | undefined;

function getOrCreateTelegramChannel(): TelegramChannel {
  if (!cachedChannel) {
    cachedChannel = createTelegramChannel({
      secretToken: getTelegramWebhookSecret(),

      async webhook({ c, update }) {
        if (!isTelegramConfigured()) {
          return c.json({ error: 'Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET_TOKEN to enable it.' }, 503);
        }

        markTelegramUpdateReceived();

        const incoming = update.message ?? update.channel_post ?? update.business_message;
        if (incoming) {
          await handleIncomingMessage(incoming, update);
          return;
        }

        if (update.callback_query) {
          await handleCallbackQuery(update.callback_query, update);
          return;
        }
      },
    });
  }
  return cachedChannel;
}

export function getTelegramChannel(): TelegramChannel | undefined {
  return isTelegramConfigured() ? getOrCreateTelegramChannel() : undefined;
}

export const channel: TelegramChannel = getOrCreateTelegramChannel();

async function handleIncomingMessage(incoming: Message, update: Update) {
  const accessCheck = shouldProcessUpdate(incoming);
  if (!accessCheck.allowed) {
    return;
  }

  const normalized = normalizeTelegramUpdate({
    update_id: update.update_id,
    message: incoming as unknown as Parameters<typeof normalizeTelegramUpdate>[0]['message'],
  });
  return dispatchTelegramNormalizedMessage({
    event: normalized,
    conversation: conversationFromMessage(incoming),
    updateId: update.update_id,
    messageId: incoming.message_id,
  });
}

type TelegramAgentDispatch = typeof dispatch;

export interface TelegramDispatchDependencies {
  dispatchAgent?: TelegramAgentDispatch;
  settleAgent?: (instanceId: string, receipt: DispatchReceipt) => Promise<AgentReply>;
  scheduleBackground?: (task: () => Promise<void>) => void;
}

export async function dispatchTelegramNormalizedMessage(
  input: {
    event: NormalizedMessageEvent;
    conversation: TelegramConversationRef;
    updateId: number;
    messageId: number;
  },
  dependencies: TelegramDispatchDependencies = {},
): Promise<DispatchReceipt> {
  const sessionResolution = resolveChatSession({ event: input.event });
  const generation = goromboPersistenceRuntime.sessionDatabase.ensureRuntimeGeneration(
    sessionResolution.sessionId,
  );
  goromboPersistenceRuntime.sessionDatabase.recordNormalizedMessageEvent({
    event: input.event,
    sessionId: sessionResolution.sessionId,
    deliveryKind: 'direct-agent',
  });

  const prompt = createChatPrompt(input.event);
  const message = generation.continuationSummary
    ? `${renderContinuationContext({
        productSessionId: sessionResolution.sessionId,
        generation: generation.generation,
        continuationSummary: generation.continuationSummary,
      })}\n\n${prompt}`
    : prompt;
  const dispatchAgent = dependencies.dispatchAgent ?? dispatch;
  const receipt = await dispatchAgent(Orchestrator, {
    id: generation.instanceId,
    idempotencyKey: telegramDispatchIdempotencyKey(input.updateId),
    initialData: {
      ...conversationData(input.conversation),
      productSessionId: sessionResolution.sessionId,
      generation: generation.generation,
      ...(generation.continuationSummary
        ? { continuationSummary: generation.continuationSummary }
        : {}),
    },
    message: {
      kind: 'signal',
      type: 'telegram.message',
      tagName: 'telegram_message',
      attributes: {
        updateId: String(input.updateId),
        eventId: input.event.id,
        messageId: String(input.messageId),
      },
      body: message,
    },
  });

  goromboPersistenceRuntime.sessionDatabase.recordNormalizedMessageEvent({
    event: input.event,
    sessionId: sessionResolution.sessionId,
    deliveryKind: 'direct-agent',
    deliveryId: receipt.submissionId,
    delivery: {
      submissionId: receipt.submissionId,
      instanceId: generation.instanceId,
      uid: receipt.uid,
      streamUrl: agentConversationUrl(generation.instanceId),
    },
    acceptedAt: receipt.acceptedAt,
  });

  const settleAgent = dependencies.settleAgent ?? settleTelegramSubmission;
  const scheduleBackground = dependencies.scheduleBackground ?? ((task) => {
    setImmediate(() => {
      void task().catch((error) => {
        console.error(
          '[WARN] Telegram submission settlement failed:',
          error instanceof Error ? error.message : String(error),
        );
      });
    });
  });
  scheduleBackground(async () => {
    const reply = await settleAgent(generation.instanceId, receipt);
    const now = new Date().toISOString();
    await goromboPersistenceRuntime.sessionDatabase.indexFlueConversationSnapshot(
      sessionResolution.sessionId,
      {
        v: 1,
        conversationId: generation.instanceId,
        offset: receipt.uid,
        settlements: [{
          submissionId: receipt.submissionId,
          outcome: 'completed',
          answeredBySubmissionId: reply.submissionId,
        }],
        messages: reply.text.trim()
          ? [{
              id: `telegram:${reply.submissionId}:assistant`,
              role: 'assistant',
              purpose: 'assistant',
              display: 'visible',
              submissionId: receipt.submissionId,
              parts: [{ type: 'text', text: reply.text, state: 'done' }],
              ...(reply.metadata ? { metadata: reply.metadata } : {}),
            }]
          : [],
      },
    );
  });

  return receipt;
}

async function settleTelegramSubmission(
  instanceId: string,
  receipt: DispatchReceipt,
): Promise<AgentReply> {
  return init(Orchestrator, { id: instanceId }).read(receipt);
}

export function telegramDispatchIdempotencyKey(updateId: number): string {
  return `telegram:update:${updateId}`;
}

async function handleCallbackQuery(query: NonNullable<Update['callback_query']>, _update: Update) {
  const data = query.data;
  if (!data) {
    await client.answerCallbackQuery(query.id);
    return;
  }

  const parsed = parseApprovalCallback(data);
  if (!parsed) {
    await client.answerCallbackQuery(query.id);
    return;
  }

  const approvalIngress = createTelegramApprovalIngress();
  if (!approvalIngress) {
    await client.answerCallbackQuery(query.id, { text: 'Approval ingress is not configured.' });
    return;
  }

  const userId = String(query.from.id);
  const adminUserIds = readTelegramAdminUserIds();
  const role = adminUserIds.includes(userId) ? 'admin' : 'operator';

  try {
    const record = await approvalIngress.getApprovalRequest(parsed.requestId);
    if (!record) {
      await client.answerCallbackQuery(query.id, { text: 'Approval request not found.' });
      return;
    }
    if (record.status !== 'pending') {
      await client.answerCallbackQuery(query.id, { text: 'This approval has already been resolved.' });
      return;
    }

    await approvalIngress.recordApprovalDecision({
      requestId: parsed.requestId,
      approved: parsed.approved,
      decidedBy: userId,
      reason: `Telegram ${parsed.approved ? 'approve' : 'deny'} button`,
      principal: { id: userId, roles: [role] },
    });

    const resolved = await approvalIngress.getApprovalRequest(parsed.requestId);
    if (resolved && query.message) {
      const messageId = query.message.message_id;
      await client.editMessageText(query.message.chat.id, messageId, buildApprovalResolvedMessage(resolved), {
        reply_markup: { inline_keyboard: [] },
      });
    }

    await client.answerCallbackQuery(query.id, { text: `Approval ${parsed.approved ? 'approved' : 'denied'}.` });
  } catch (err) {
    await client.answerCallbackQuery(query.id, { text: 'Failed to record decision.' });
  }
}

function createTelegramApprovalIngress() {
  const approvalRoot = process.env.GOROMBO_APPROVAL_ROOT;
  if (!approvalRoot) {
    return undefined;
  }
  const approvalService = createSharedCodingApprovalService({ GOROMBO_APPROVAL_ROOT: approvalRoot });
  return createApprovalIngress({
    approvalService,
    bindingStore: createFileApprovalBindingStore(approvalRoot),
  });
}

export function resolveTelegramApprovalPrincipal(userId: string, adminUserIds: string[]): 'admin' | 'operator' {
  return adminUserIds.includes(userId) ? 'admin' : 'operator';
}

function readTelegramAdminUserIds(): string[] {
  const raw = process.env.TELEGRAM_ADMIN_USER_IDS;
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return [];
  }
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

function conversationFromMessage(message: Message): TelegramConversationRef {
  return {
    type: 'chat',
    chatId: message.chat.id,
    messageThreadId: message.message_thread_id,
    directMessagesTopicId: message.direct_messages_topic?.topic_id,
  };
}

function conversationData(conversation: TelegramConversationRef) {
  return {
    connector: 'telegram' as const,
    chatId: conversation.chatId,
    messageThreadId: conversation.messageThreadId,
    directMessagesTopicId: conversation.directMessagesTopicId,
  };
}
