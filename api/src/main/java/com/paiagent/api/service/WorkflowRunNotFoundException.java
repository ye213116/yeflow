package com.paiagent.api.service;

public class WorkflowRunNotFoundException extends RuntimeException {

    public WorkflowRunNotFoundException(Long runId) {
        super("Workflow run not found: " + runId);
    }
}
