package com.paiagent.api.provider.llm;

public record LlmProviderResponse(
        String content,
        String model) {
}
