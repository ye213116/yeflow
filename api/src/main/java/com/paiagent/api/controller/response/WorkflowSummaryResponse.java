package com.paiagent.api.controller.response;

import java.time.LocalDateTime;

public record WorkflowSummaryResponse(
        Long id,
        String name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        int nodeCount) {
}
