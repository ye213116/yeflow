package com.paiagent.api.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.paiagent.api.controller.request.WorkflowRunCreateRequest;
import com.paiagent.api.controller.response.WorkflowRunDetailResponse;
import com.paiagent.api.controller.response.WorkflowRunStepResponse;
import com.paiagent.api.domain.runtime.WorkflowRunStatus;
import com.paiagent.api.domain.runtime.WorkflowStepExecutionResult;
import com.paiagent.api.entity.WorkflowEntity;
import com.paiagent.api.entity.WorkflowNodeEntity;
import com.paiagent.api.entity.WorkflowRunEntity;
import com.paiagent.api.entity.WorkflowRunStepEntity;
import com.paiagent.api.repository.WorkflowRepository;
import com.paiagent.api.repository.WorkflowRunRepository;

@Service
public class WorkflowRunService {

    private final WorkflowRepository workflowRepository;
    private final WorkflowRunRepository workflowRunRepository;
    private final WorkflowRunExecutor workflowRunExecutor;

    public WorkflowRunService(
            WorkflowRepository workflowRepository,
            WorkflowRunRepository workflowRunRepository,
            WorkflowRunExecutor workflowRunExecutor) {
        this.workflowRepository = workflowRepository;
        this.workflowRunRepository = workflowRunRepository;
        this.workflowRunExecutor = workflowRunExecutor;
    }

    @Transactional
    public WorkflowRunDetailResponse createRun(Long workflowId, WorkflowRunCreateRequest request) {
        WorkflowEntity workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new WorkflowNotFoundException(workflowId));

        WorkflowRunEntity run = new WorkflowRunEntity();
        run.setWorkflow(workflow);
        run.setStatus(WorkflowRunStatus.PENDING);
        run.setInputPayload(normalizePayload(request.input()));

        workflowRunRepository.save(run);
        executeSerialWorkflow(workflow, run);
        workflowRunRepository.saveAndFlush(run);
        return toDetailResponse(run);
    }

    @Transactional(readOnly = true)
    public WorkflowRunDetailResponse getRun(Long runId) {
        WorkflowRunEntity run = workflowRunRepository.findById(runId)
                .orElseThrow(() -> new WorkflowRunNotFoundException(runId));

        return toDetailResponse(run);
    }

    private void executeSerialWorkflow(WorkflowEntity workflow, WorkflowRunEntity run) {
        List<WorkflowNodeEntity> nodes = workflow.getNodes().stream()
                .sorted(Comparator.comparing(WorkflowNodeEntity::getNodeOrder))
                .toList();

        run.setStatus(WorkflowRunStatus.RUNNING);
        run.setStartedAt(LocalDateTime.now());

        String currentPayload = run.getInputPayload();

        try {
            // Phase 2 保持同步串行执行，先把每一步的轨迹写清楚，比过早引入异步调度更适合 MVP 验收。
            for (WorkflowNodeEntity node : nodes) {
                WorkflowRunStepEntity step = new WorkflowRunStepEntity();
                step.setNodeKey(node.getNodeKey());
                step.setNodeType(node.getNodeType());
                step.setStepOrder(node.getNodeOrder());
                step.setStatus(WorkflowRunStatus.PENDING);
                run.addStep(step);

                WorkflowStepExecutionResult result = workflowRunExecutor.executeStep(node, currentPayload, step);
                currentPayload = result.outputPayload();
            }

            run.setOutputPayload(currentPayload);
            run.setStatus(WorkflowRunStatus.SUCCEEDED);
            run.setFinishedAt(LocalDateTime.now());
        } catch (RuntimeException exception) {
            // 失败时保留最后一个可用 payload，后续调试页至少还能看到链路在何处中断。
            run.setOutputPayload(currentPayload);
            run.setStatus(WorkflowRunStatus.FAILED);
            run.setErrorMessage(exception.getMessage());
            run.setFinishedAt(LocalDateTime.now());
        }
    }

    private WorkflowRunDetailResponse toDetailResponse(WorkflowRunEntity run) {
        List<WorkflowRunStepResponse> steps = run.getSteps().stream()
                .sorted(Comparator.comparing(WorkflowRunStepEntity::getStepOrder))
                .map(step -> new WorkflowRunStepResponse(
                        step.getId(),
                        step.getNodeKey(),
                        step.getNodeType(),
                        step.getStepOrder(),
                        step.getStatus(),
                        step.getInputPayload(),
                        step.getOutputPayload(),
                        step.getErrorMessage(),
                        step.getStartedAt(),
                        step.getFinishedAt()))
                .toList();

        return new WorkflowRunDetailResponse(
                run.getId(),
                run.getWorkflow().getId(),
                run.getStatus(),
                run.getInputPayload(),
                run.getOutputPayload(),
                run.getErrorMessage(),
                run.getCreatedAt(),
                run.getUpdatedAt(),
                run.getStartedAt(),
                run.getFinishedAt(),
                steps);
    }

    private String normalizePayload(String payload) {
        if (payload == null) {
            return null;
        }

        String trimmedPayload = payload.trim();
        return trimmedPayload.isEmpty() ? null : trimmedPayload;
    }
}
