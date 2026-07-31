import { createCodingApprovalRequest } from '../../engine/workers/coding-worker/approvals/approval-policy.js';
import type { CodingApprovalService } from '../../engine/workers/coding-worker/approvals/approval-service.js';
import type {
  CodingApprovalActionType,
  CodingApprovalMetadata,
} from '../../engine/workers/coding-worker/approvals/approval-types.js';

export interface EvaluateApprovalInput {
  approvalService: CodingApprovalService;
  taskId: string;
  actionType: CodingApprovalActionType;
  summary: string;
  reason: string;
  risk: string;
  target?: string;
  requestedBy?: string;
  expiresAt?: string;
  metadata?: CodingApprovalMetadata;
}

export async function evaluateApproval(input: EvaluateApprovalInput) {
  const proposed = createCodingApprovalRequest({
    taskId: input.taskId,
    actionType: input.actionType,
    summary: input.summary,
    reason: input.reason,
    risk: input.risk,
    target: input.target,
    requestedBy: input.requestedBy,
    expiresAt: input.expiresAt,
    metadata: input.metadata,
  });
  const latest = (await input.approvalService.listRecords(input.taskId))
    .filter((record) => record.request.dedupeKey === proposed.dedupeKey)
    .sort((left, right) => right.request.createdAt.localeCompare(left.request.createdAt))[0];

  if (latest) {
    const evaluation = await input.approvalService.evaluateRequest(latest.request);
    if (evaluation.allowed || evaluation.status === 'denied') {
      return { request: latest.request, evaluation };
    }
  }

  const request = await input.approvalService.createRequest({
    taskId: input.taskId,
    actionType: input.actionType,
    summary: input.summary,
    reason: input.reason,
    risk: input.risk,
    target: input.target,
    requestedBy: input.requestedBy,
    expiresAt: input.expiresAt,
    metadata: input.metadata,
  });
  return {
    request,
    evaluation: await input.approvalService.evaluateRequest(request),
  };
}
