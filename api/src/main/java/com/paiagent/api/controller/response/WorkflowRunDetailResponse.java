package com.paiagent.api.controller.response;

import java.time.LocalDateTime;
import java.util.List;

import com.paiagent.api.domain.runtime.WorkflowRunStatus;

public record WorkflowRunDetailResponse(
        Long id,
        Long workflowId,
        WorkflowRunStatus status,
        String inputPayload,
        String outputPayload,
        String errorMessage,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime startedAt,
        LocalDateTime finishedAt,
        List<WorkflowRunStepResponse> steps) {
}
