package com.paiagent.api.controller.request;

import com.paiagent.api.domain.workflow.WorkflowNodeType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record WorkflowNodeRequest(
        @NotBlank(message = "nodeKey is required")
        @Size(max = 120, message = "nodeKey must be at most 120 characters")
        String nodeKey,
        @NotNull(message = "nodeType is required")
        WorkflowNodeType nodeType,
        @NotNull(message = "nodeOrder is required")
        @Positive(message = "nodeOrder must be greater than 0")
        Integer nodeOrder,
        @Size(max = 4000, message = "config must be at most 4000 characters")
        String config) {
}
