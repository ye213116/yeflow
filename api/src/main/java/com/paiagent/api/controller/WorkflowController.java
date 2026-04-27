package com.paiagent.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.paiagent.api.controller.request.WorkflowUpsertRequest;
import com.paiagent.api.controller.response.WorkflowDetailResponse;
import com.paiagent.api.controller.response.WorkflowRunDetailResponse;
import com.paiagent.api.controller.response.WorkflowSummaryResponse;
import com.paiagent.api.controller.request.WorkflowRunCreateRequest;
import com.paiagent.api.service.WorkflowRunService;
import com.paiagent.api.service.WorkflowService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowService workflowService;
    private final WorkflowRunService workflowRunService;

    public WorkflowController(
            WorkflowService workflowService,
            WorkflowRunService workflowRunService) {
        this.workflowService = workflowService;
        this.workflowRunService = workflowRunService;
    }

    @GetMapping
    public List<WorkflowSummaryResponse> listWorkflows() {
        return workflowService.listWorkflows();
    }

    @GetMapping("/{workflowId}")
    public WorkflowDetailResponse getWorkflow(@PathVariable Long workflowId) {
        return workflowService.getWorkflow(workflowId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkflowDetailResponse createWorkflow(@Valid @RequestBody WorkflowUpsertRequest request) {
        return workflowService.createWorkflow(request);
    }

    @PostMapping("/{workflowId}/runs")
    @ResponseStatus(HttpStatus.CREATED)
    public WorkflowRunDetailResponse createRun(
            @PathVariable Long workflowId,
            @Valid @RequestBody WorkflowRunCreateRequest request) {
        return workflowRunService.createRun(workflowId, request);
    }

    @PutMapping("/{workflowId}")
    public WorkflowDetailResponse updateWorkflow(
            @PathVariable Long workflowId,
            @Valid @RequestBody WorkflowUpsertRequest request) {
        return workflowService.updateWorkflow(workflowId, request);
    }
}
