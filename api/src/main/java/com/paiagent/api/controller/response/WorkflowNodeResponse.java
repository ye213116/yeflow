package com.paiagent.api.controller.response;

import com.paiagent.api.domain.workflow.WorkflowNodeType;

public record WorkflowNodeResponse(
        String nodeKey,
        WorkflowNodeType nodeType,
        Integer nodeOrder,
        String config) {
}
