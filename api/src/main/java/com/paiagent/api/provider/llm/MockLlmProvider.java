package com.paiagent.api.provider.llm;

import org.springframework.stereotype.Component;

@Component
public class MockLlmProvider implements LlmProvider {

    @Override
    public LlmProviderResponse generate(String inputPayload, String nodeConfig) {
        if (nodeConfig != null && nodeConfig.contains("\"fail\":true")) {
            throw new IllegalStateException("Mock LLM provider forced failure by node config");
        }

        String content = """
                Mock LLM output
                input=%s
                config=%s
                """.formatted(
                inputPayload == null ? "" : inputPayload,
                nodeConfig == null ? "{}" : nodeConfig);

        return new LlmProviderResponse(content.trim(), "mock-llm-v1");
    }
}
