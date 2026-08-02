import { defineTool } from '@flue/runtime';
import { Api } from 'grammy';
import { chunkTelegramText } from '../api/connectors/telegram/telegram-api.js';
import type { NormalizedMessageEvent } from '../core/types/index.js';
import { goromboPersistenceRuntime } from '../db.js';
import * as v from 'valibot';

type TelegramReplyClient = Pick<Api, 'sendMessage'>;

interface TelegramReplyToolDependencies {
  client?: TelegramReplyClient;
  loadEvent?: (eventId: string) => NormalizedMessageEvent | undefined;
}

export interface TelegramConversationData {
  connector: 'telegram';
  chatId: string | number;
  messageThreadId?: number;
  directMessagesTopicId?: number;
}

export interface TelegramDeliveryBinding {
  eventId: string;
  replyToMessageId?: number;
}

function isTestMode(): boolean {
  return process.env.NODE_ENV === 'test' || process.env.GOROMBO_TEST_MODE === '1';
}

function getTelegramBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (token) {
    return token;
  }
  if (isTestMode()) {
    return 'placeholder-token';
  }
  throw new Error('TELEGRAM_BOT_TOKEN environment variable is required for Telegram API calls.');
}

function getTelegramApiRoot(): string | undefined {
  const configured = process.env.TELEGRAM_API_ROOT?.trim();
  return configured ? configured.replace(/\/+$/, '') : undefined;
}

let cachedClient: Api | undefined;

function getClient(): Api {
  if (!cachedClient) {
    cachedClient = new Api(getTelegramBotToken(), {
      ...(getTelegramApiRoot() ? { apiRoot: getTelegramApiRoot() } : {}),
    });
  }
  return cachedClient;
}

export const client = new Proxy({} as Api, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});

export function createTelegramReplyTool(
  conversation: TelegramConversationData | undefined,
  delivery: TelegramDeliveryBinding | undefined,
  dependencies: TelegramReplyToolDependencies = {},
) {
  const telegramClient = dependencies.client ?? client;
  const loadEvent =
    dependencies.loadEvent ??
    ((trustedEventId: string) =>
      goromboPersistenceRuntime.sessionDatabase.getNormalizedMessageEvent(trustedEventId));

  return defineTool({
    name: 'telegram_reply',
    description:
      'Send the final response to the Telegram chat bound to the current verified delivery. Only use this for a Telegram event.',
    input: v.object({
      text: v.pipe(v.string(), v.minLength(1)),
      format: v.optional(v.picklist(['text', 'markdownv2'])),
    }),
    run: async ({ data: { text, format }, log }) => {
      if (!conversation) {
        throw new Error('telegram_reply is missing the Telegram conversation bound at instance creation.');
      }
      if (!delivery) {
        throw new Error('telegram_reply is missing the current verified Telegram delivery event.');
      }
      const event = loadEvent(delivery.eventId);
      if (!event || event.connector !== 'telegram') {
        throw new Error('telegram_reply requires the current trusted Telegram event.');
      }

      if (String(conversation.chatId) !== event.conversation.id) {
        throw new Error('telegram_reply delivery does not match the bound Telegram conversation.');
      }
      const chunks = chunkTelegramText(text);
      log.info('Telegram send started.', {
        event: 'telegram.send_started',
        chunkCount: chunks.length,
      });
      try {
        for (const [index, chunk] of chunks.entries()) {
          await telegramClient.sendMessage(conversation.chatId, chunk, {
            reply_to_message_id: index === 0 ? delivery.replyToMessageId : undefined,
            message_thread_id: conversation.messageThreadId,
            direct_messages_topic_id: conversation.directMessagesTopicId,
            parse_mode: format === 'markdownv2' ? 'MarkdownV2' : undefined,
          });
        }
      } catch (error) {
        log.error('Telegram send failed.', {
          event: 'telegram.send_failed',
          chunkCount: chunks.length,
          errorType: error instanceof Error ? error.name : 'unknown',
        });
        throw error;
      }
      log.info('Telegram send completed.', {
        event: 'telegram.send_completed',
        chunkCount: chunks.length,
      });

      return 'sent';
    },
  });
}

export function resolveTelegramDelivery(delivery: {
  kind: string;
  type?: string;
  attributes?: Record<string, string>;
}): TelegramDeliveryBinding | undefined {
  if (delivery.kind !== 'signal' || delivery.type !== 'telegram.message') {
    return undefined;
  }
  const eventId = delivery.attributes?.eventId?.trim();
  if (!eventId) {
    return undefined;
  }
  const replyToMessageId = Number(delivery.attributes?.messageId);
  return {
    eventId,
    ...(Number.isSafeInteger(replyToMessageId) && replyToMessageId > 0
      ? { replyToMessageId }
      : {}),
  };
}

export function asTelegramConversationData(
  value: unknown,
): TelegramConversationData | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  const candidate = value as Partial<TelegramConversationData>;
  if (
    candidate.connector !== 'telegram' ||
    (typeof candidate.chatId !== 'string' && typeof candidate.chatId !== 'number')
  ) {
    return undefined;
  }
  return candidate as TelegramConversationData;
}
