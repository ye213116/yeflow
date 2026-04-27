package com.paiagent.api.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.paiagent.api.controller.request.WorkflowNodeRequest;
import com.paiagent.api.controller.request.WorkflowUpsertRequest;
import com.paiagent.api.controller.response.WorkflowDetailResponse;
import com.paiagent.api.controller.response.WorkflowNodeResponse;
import com.paiagent.api.controller.response.WorkflowSummaryResponse;
import com.paiagent.api.domain.workflow.WorkflowDefinition;
import com.paiagent.api.domain.workflow.WorkflowDefinitionValidator;
import com.paiagent.api.domain.workflow.WorkflowNodeDefinition;
import com.paiagent.api.entity.WorkflowEntity;
import com.paiagent.api.entity.WorkflowNodeEntity;
import com.paiagent.api.repository.WorkflowRepository;

@Service
public class WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final WorkflowDefinitionValidator workflowDefinitionValidator;

    public WorkflowService(
            WorkflowRepository workflowRepository,
            WorkflowDefinitionValidator workflowDefinitionValidator) {
        this.workflowRepository = workflowRepository;
        this.workflowDefinitionValidator = workflowDefinitionValidator;
    }

    @Transactional(readOnly = true)
    public List<WorkflowSummaryResponse> listWorkflows() {
        return workflowRepository.findAllByOrderByUpdatedAtDescIdDesc().stream()
                .map(workflow -> new WorkflowSummaryResponse(
                        workflow.getId(),
                        workflow.getName(),
                        workflow.getDescription(),
                        workflow.getCreatedAt(),
                        workflow.getUpdatedAt(),
                        workflow.getNodes().size()))
                .toList();
    }

    @Transactional(readOnly = true)
    public WorkflowDetailResponse getWorkflow(Long workflowId) {
        WorkflowEntity workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new WorkflowNotFoundException(workflowId));

        return toDetailResponse(workflow);
    }

    @Transactional
    public WorkflowDetailResponse createWorkflow(WorkflowUpsertRequest request) {
        WorkflowDefinition workflowDefinition = toDefinition(request);
        workflowDefinitionValidator.validate(workflowDefinition);

        WorkflowEntity workflow = new WorkflowEntity();
        applyDefinition(workflow, workflowDefinition);

        return toDetailResponse(workflowRepository.save(workflow));
    }

    @Transactional
    public WorkflowDetailResponse updateWorkflow(Long workflowId, WorkflowUpsertRequest request) {
        WorkflowDefinition workflowDefinition = toDefinition(request);
        workflowDefinitionValidator.validate(workflowDefinition);

        WorkflowEntity workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new WorkflowNotFoundException(workflowId));

        applyDefinition(workflow, workflowDefinition);
        return toDetailResponse(workflowRepository.save(workflow));
    }

    private WorkflowDefinition toDefinition(WorkflowUpsertRequest request) {
        List<WorkflowNodeDefinition> nodes = request.nodes().stream()
                .map(this::toNodeDefinition)
                .toList();

        return new WorkflowDefinition(request.name(), request.description(), nodes);
    }

    private WorkflowNodeDefinition toNodeDefinition(WorkflowNodeRequest request) {
        return new WorkflowNodeDefinition(
                request.nodeKey().trim(),
                request.nodeType(),
                request.nodeOrder(),
                normalizeConfig(request.config()));
    }

    private void applyDefinition(WorkflowEntity workflow, WorkflowDefinition workflowDefinition) {
        workflow.setName(workflowDefinition.name().trim());
        workflow.setDescription(normalizeDescription(workflowDefinition.description()));

        // Phase 1 的编辑模型是“提交整个串行定义”，这样后端不需要在当前阶段承担局部 diff 合并的复杂度。
        workflow.replaceNodes(workflowDefinition.nodes().stream()
                .sorted(Comparator.comparing(WorkflowNodeDefinition::nodeOrder))
                .map(this::toNodeEntity)
                .toList());
    }

    private WorkflowNodeEntity toNodeEntity(WorkflowNodeDefinition workflowNodeDefinition) {
        WorkflowNodeEntity node = new WorkflowNodeEntity();
        node.setNodeKey(workflowNodeDefinition.nodeKey());
        node.setNodeType(workflowNodeDefinition.nodeType());
        node.setNodeOrder(workflowNodeDefinition.nodeOrder());
        node.setConfigJson(workflowNodeDefinition.config());
        return node;
    }

    private WorkflowDetailResponse toDetailResponse(WorkflowEntity workflow) {
        List<WorkflowNodeResponse> nodes = workflow.getNodes().stream()
                .sorted(Comparator.comparing(WorkflowNodeEntity::getNodeOrder))
                .map(node -> new WorkflowNodeResponse(
                        node.getNodeKey(),
                        node.getNodeType(),
                        node.getNodeOrder(),
                        node.getConfigJson()))
                .toList();

        return new WorkflowDetailResponse(
                workflow.getId(),
                workflow.getName(),
                workflow.getDescription(),
                workflow.getCreatedAt(),
                workflow.getUpdatedAt(),
                nodes);
    }

    private String normalizeDescription(String description) {
        if (description == null) {
            return null;
        }

        // 空字符串统一折叠成 null，避免后续详情页和存储层同时处理“空但不为空”的双重语义。
        String trimmedDescription = description.trim();
        return trimmedDescription.isEmpty() ? null : trimmedDescription;
    }

    private String normalizeConfig(String config) {
        if (config == null) {
            return null;
        }

        String trimmedConfig = config.trim();
        return trimmedConfig.isEmpty() ? null : trimmedConfig;
    }
}
