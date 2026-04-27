package com.paiagent.api.provider.tts;

public record TtsProviderResponse(
        String text,
        String voice,
        String audioUrl) {
}
