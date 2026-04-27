package com.paiagent.api.service;

public class WorkflowNotFoundException extends RuntimeException {

    public WorkflowNotFoundException(Long workflowId) {
        super("Workflow not found: " + workflowId);
    }
}
