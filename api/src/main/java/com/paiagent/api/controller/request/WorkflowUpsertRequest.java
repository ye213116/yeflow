package com.paiagent.api.controller.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record WorkflowUpsertRequest(
        @NotBlank(message = "name is required")
        @Size(max = 120, message = "name must be at most 120 characters")
        String name,
        @Size(max = 1000, message = "description must be at most 1000 characters")
        String description,
        @NotEmpty(message = "nodes are required")
        List<@Valid WorkflowNodeRequest> nodes) {
}
