package com.paiagent.api.domain.runtime;

public record WorkflowStepExecutionResult(
        String inputPayload,
        String outputPayload) {
}
