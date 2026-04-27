package com.paiagent.api.controller.request;

import jakarta.validation.constraints.Size;

public record WorkflowRunCreateRequest(
        @Size(max = 4000, message = "input must be at most 4000 characters")
        String input) {
}
