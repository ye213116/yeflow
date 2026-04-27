package com.paiagent.api.provider.tts;

import org.springframework.stereotype.Component;

@Component
public class MockTtsProvider implements TtsProvider {

    @Override
    public TtsProviderResponse synthesize(String inputPayload, String nodeConfig) {
        if (nodeConfig != null && nodeConfig.contains("\"fail\":true")) {
            throw new IllegalStateException("Mock TTS provider forced failure by node config");
        }

        String voice = nodeConfig != null && nodeConfig.contains("voice")
                ? "configured-voice"
                : "mock-voice";

        return new TtsProviderResponse(
                inputPayload,
                voice,
                "mock://audio/" + System.nanoTime());
    }
}
