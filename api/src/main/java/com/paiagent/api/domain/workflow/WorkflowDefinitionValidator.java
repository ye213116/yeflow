package com.paiagent.api.domain.workflow;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class WorkflowDefinitionValidator {

    public void validate(WorkflowDefinition workflowDefinition) {
        if (workflowDefinition.nodes().isEmpty()) {
            throw new WorkflowValidationException("Workflow must contain at least one node");
        }

        // Phase 1 先把工作流收敛成严格线性结构，避免后续运行引擎在 MVP 阶段承担图遍历和分支合流复杂度。
        List<WorkflowNodeDefinition> sortedNodes = workflowDefinition.nodes().stream()
                .sorted(Comparator.comparing(WorkflowNodeDefinition::nodeOrder))
                .toList();

        validateUniqueNodeKeys(workflowDefinition.nodes());
        validateContinuousNodeOrder(sortedNodes);
        validateBoundaryNodes(sortedNodes);
        validateMiddleNodes(sortedNodes);
    }

    private void validateUniqueNodeKeys(List<WorkflowNodeDefinition> nodes) {
        Set<String> nodeKeys = nodes.stream()
                .map(WorkflowNodeDefinition::nodeKey)
                .collect(Collectors.toSet());

        if (nodeKeys.size() != nodes.size()) {
            throw new WorkflowValidationException("Workflow node keys must be unique within one workflow");
        }
    }

    private void validateContinuousNodeOrder(List<WorkflowNodeDefinition> sortedNodes) {
        // 这里强制从 1 连续递增，是为了让“节点顺序”直接等价于“执行顺序”，避免出现跳号后语义不清的问题。
        for (int index = 0; index < sortedNodes.size(); index++) {
            int expectedOrder = index + 1;
            Integer actualOrder = sortedNodes.get(index).nodeOrder();
            if (!Integer.valueOf(expectedOrder).equals(actualOrder)) {
                throw new WorkflowValidationException("Workflow nodeOrder must be continuous starting from 1");
            }
        }
    }

    private void validateBoundaryNodes(List<WorkflowNodeDefinition> sortedNodes) {
        long startCount = sortedNodes.stream()
                .filter(node -> node.nodeType() == WorkflowNodeType.START)
                .count();
        long endCount = sortedNodes.stream()
                .filter(node -> node.nodeType() == WorkflowNodeType.END)
                .count();

        if (startCount != 1) {
            throw new WorkflowValidationException("Workflow must contain exactly one START node");
        }

        if (endCount != 1) {
            throw new WorkflowValidationException("Workflow must contain exactly one END node");
        }

        // MVP 第一版不支持人工拼装入口/出口图结构，因此直接锁死边界节点位置，减少后续误配。
        if (sortedNodes.getFirst().nodeType() != WorkflowNodeType.START) {
            throw new WorkflowValidationException("START node must be the first node in the serial workflow");
        }

        if (sortedNodes.getLast().nodeType() != WorkflowNodeType.END) {
            throw new WorkflowValidationException("END node must be the last node in the serial workflow");
        }
    }

    private void validateMiddleNodes(List<WorkflowNodeDefinition> sortedNodes) {
        if (sortedNodes.size() <= 2) {
            return;
        }

        for (int index = 1; index < sortedNodes.size() - 1; index++) {
            WorkflowNodeType nodeType = sortedNodes.get(index).nodeType();
            if (nodeType == WorkflowNodeType.LLM || nodeType == WorkflowNodeType.TTS) {
                continue;
            }

            // 中间节点只开放两种能力节点，先把运行面收窄，避免前后端都提前面对未定义节点语义。
            throw new WorkflowValidationException("Only LLM or TTS nodes are allowed between START and END");
        }
    }
}
