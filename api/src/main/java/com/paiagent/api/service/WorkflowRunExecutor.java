package com.paiagent.api.service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.paiagent.api.domain.runtime.WorkflowRunStatus;
import com.paiagent.api.domain.runtime.WorkflowStepExecutionResult;
import com.paiagent.api.domain.workflow.WorkflowNodeType;
import com.paiagent.api.entity.WorkflowNodeEntity;
import com.paiagent.api.entity.WorkflowRunStepEntity;
import com.paiagent.api.provider.llm.LlmProvider;
import com.paiagent.api.provider.tts.TtsProvider;

@Component
public class WorkflowRunExecutor {

    private final LlmProvider llmProvider;
    private final TtsProvider ttsProvider;
    private final ObjectMapper objectMapper;

    public WorkflowRunExecutor(
            LlmProvider llmProvider,
            TtsProvider ttsProvider,
            ObjectMapper objectMapper) {
        this.llmProvider = llmProvider;
        this.ttsProvider = ttsProvider;
        this.objectMapper = objectMapper;
    }

    public WorkflowStepExecutionResult executeStep(
            WorkflowNodeEntity node,
            String currentPayload,
            WorkflowRunStepEntity step) {
        step.setStatus(WorkflowRunStatus.RUNNING);
        step.setStartedAt(LocalDateTime.now());
        step.setInputPayload(currentPayload);

        try {
            WorkflowStepExecutionResult result = switch (node.getNodeType()) {
                case START -> new WorkflowStepExecutionResult(currentPayload, currentPayload);
                case LLM -> executeLlmStep(currentPayload, node.getConfigJson());
                case TTS -> executeTtsStep(currentPayload, node.getConfigJson());
                case END -> new WorkflowStepExecutionResult(currentPayload, currentPayload);
            };

            step.setOutputPayload(result.outputPayload());
            step.setStatus(WorkflowRunStatus.SUCCEEDED);
            step.setFinishedAt(LocalDateTime.now());
            return result;
        } catch (RuntimeException exception) {
            step.setStatus(WorkflowRunStatus.FAILED);
            step.setErrorMessage(exception.getMessage());
            step.setFinishedAt(LocalDateTime.now());
            throw exception;
        }
    }

    private WorkflowStepExecutionResult executeLlmStep(String inputPayload, String nodeConfig) {
        var response = llmProvider.generate(inputPayload, nodeConfig);
        String outputPayload = toJson(payloadOf(
                "type", WorkflowNodeType.LLM.name(),
                "content", response.content(),
                "model", response.model()));

        return new WorkflowStepExecutionResult(inputPayload, outputPayload);
    }

    private WorkflowStepExecutionResult executeTtsStep(String inputPayload, String nodeConfig) {
        var response = ttsProvider.synthesize(inputPayload, nodeConfig);
        String outputPayload = toJson(payloadOf(
                "type", WorkflowNodeType.TTS.name(),
                "text", response.text(),
                "voice", response.voice(),
                "audioUrl", response.audioUrl()));

        return new WorkflowStepExecutionResult(inputPayload, outputPayload);
    }

    // 运行态 payload 允许保留空值，便于前端调试时区分“未产生结果”和“字段缺失”两种情况。
    private Map<String, Object> payloadOf(
            String key1, Object value1,
            String key2, Object value2,
            String key3, Object value3) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put(key1, value1);
        payload.put(key2, value2);
        payload.put(key3, value3);
        return payload;
    }

    private Map<String, Object> payloadOf(
            String key1, Object value1,
            String key2, Object value2,
            String key3, Object value3,
            String key4, Object value4) {
        Map<String, Object> payload = payloadOf(key1, value1, key2, value2, key3, value3);
        payload.put(key4, value4);
        return payload;
    }

    private String toJson(Map<String, Object> payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to serialize workflow step payload", exception);
        }
    }
}
