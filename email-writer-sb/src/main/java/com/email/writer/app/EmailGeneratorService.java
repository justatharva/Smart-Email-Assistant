
package com.email.writer.app;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.model}")
    private String groqApiModel;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {

        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "model", groqApiModel,
                "messages", List.of(
                        Map.of(
                                "role", "system",
                                "content", "You are a professional email assistant. Generate clear, natural and contextually appropriate email replies."
                        ),
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                ),
                "max_completion_tokens", 1024
        );

        JsonNode response = webClient.post()
                .uri(groqApiUrl)
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + groqApiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        return extractResponseContent(response);
    }

    private String extractResponseContent(JsonNode response) {

        if (response == null) {
            throw new RuntimeException("Empty response received from Groq API");
        }

        JsonNode content = response
                .path("choices")
                .path(0)
                .path("message")
                .path("content");

        if (content.isMissingNode() || content.isNull()) {
            throw new RuntimeException(
                    "No email reply content found in Groq response"
            );
        }

        return content.asText();
    }

    private String buildPrompt(EmailRequest emailRequest) {

        return "Generate a professional email reply for the following email content. "
                + "Use this tone: " + emailRequest.getTone() + ". "
                + "Email content: " + emailRequest.getEmailContent();
    }
}
