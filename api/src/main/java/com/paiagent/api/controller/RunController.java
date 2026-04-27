package com.paiagent.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paiagent.api.controller.response.WorkflowRunDetailResponse;
import com.paiagent.api.service.WorkflowRunService;

@RestController
@RequestMapping("/api/runs")
public class RunController {

    private final WorkflowRunService workflowRunService;

    public RunController(WorkflowRunService workflowRunService) {
        this.workflowRunService = workflowRunService;
    }

    @GetMapping("/{runId}")
    public WorkflowRunDetailResponse getRun(@PathVariable Long runId) {
        return workflowRunService.getRun(runId);
    }
}
