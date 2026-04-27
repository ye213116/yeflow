package com.paiagent.api.provider.tts;

public interface TtsProvider {

    TtsProviderResponse synthesize(String inputPayload, String nodeConfig);
}
