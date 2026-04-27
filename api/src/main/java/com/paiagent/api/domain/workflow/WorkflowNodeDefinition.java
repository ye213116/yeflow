package com.paiagent.api.domain.workflow;

public record WorkflowNodeDefinition(
        String nodeKey,
        WorkflowNodeType nodeType,
        Integer nodeOrder,
        String config) {
}
