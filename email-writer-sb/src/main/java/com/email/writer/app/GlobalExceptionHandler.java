package com.email.writer.app;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(WebClientResponseException.class)
    public ResponseEntity<Map<String, String>> handleGeminiError(
            WebClientResponseException ex) {

        HttpStatus status = ex.getStatusCode().value() == 503
                ? HttpStatus.SERVICE_UNAVAILABLE
                : HttpStatus.BAD_GATEWAY;

        String message;

        if (ex.getStatusCode().value() == 503) {
            message = "Gemini AI service is currently busy. Please try again later.";
        } else {
            message = "Unable to get a response from Gemini AI. Please try again.";
        }

        Map<String, String> response = Map.of(
                "error", status.getReasonPhrase(),
                "message", message
        );

        return ResponseEntity
                .status(status)
                .body(response);
    }
}