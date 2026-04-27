package com.paiagent.api.domain.workflow;

import java.util.List;

public record WorkflowDefinition(
        String name,
        String description,
        List<WorkflowNodeDefinition> nodes) {

    public WorkflowDefinition {
        nodes = nodes == null ? List.of() : List.copyOf(nodes);
    }
}
