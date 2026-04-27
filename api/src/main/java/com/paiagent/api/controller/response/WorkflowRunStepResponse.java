package com.paiagent.api.controller.response;

import java.time.LocalDateTime;

import com.paiagent.api.domain.runtime.WorkflowRunStatus;
import com.paiagent.api.domain.workflow.WorkflowNodeType;

public record WorkflowRunStepResponse(
        Long id,
        String nodeKey,
        WorkflowNodeType nodeType,
        Integer stepOrder,
        WorkflowRunStatus status,
        String inputPayload,
        String outputPayload,
        String errorMessage,
        LocalDateTime startedAt,
        LocalDateTime finishedAt) {
}
