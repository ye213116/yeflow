package com.paiagent.api.controller;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public HealthResponse health() {
        return new HealthResponse("UP", "paiagent-api", LocalDateTime.now());
    }

    public record HealthResponse(String status, String service, LocalDateTime timestamp) {
    }
}
