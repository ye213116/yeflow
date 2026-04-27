package com.paiagent.api.controller.response;

import java.time.LocalDateTime;
import java.util.List;

public record WorkflowDetailResponse(
        Long id,
        String name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<WorkflowNodeResponse> nodes) {
}
