package com.paiagent.api.provider.llm;

public interface LlmProvider {

    LlmProviderResponse generate(String inputPayload, String nodeConfig);
}
