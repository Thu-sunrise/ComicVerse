package com.comicverse.gateway.filter;

import com.comicverse.gateway.model.ApiError;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;

/**
 * Global error handling filter for the API Gateway.
 *
 * Ensures consistent JSON error response format across all routes:
 * {
 *   "timestamp": "...",
 *   "status": 503,
 *   "code": "SERVICE_UNAVAILABLE",
 *   "message": "...",
 *   "path": "/api/v1/stories",
 *   "requestId": "..."
 * }
 *
 * NEVER exposes stack traces to clients.
 */
@Component
public class GlobalErrorFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(GlobalErrorFilter.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 1; // After RequestIdFilter
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange)
                .onErrorResume(throwable -> handleError(exchange, throwable));
    }

    private Mono<Void> handleError(ServerWebExchange exchange, Throwable throwable) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();

        String requestId = request.getHeaders().getFirst(RequestIdFilter.REQUEST_ID_HEADER);
        String path = request.getPath().value();

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String code = "INTERNAL_ERROR";
        String message = "An unexpected error occurred. Please try again.";

        // Map exception types to appropriate HTTP status codes
        String exceptionName = throwable.getClass().getSimpleName();
        if (exceptionName.contains("ConnectException") || exceptionName.contains("WebClientResponseException")) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            code = "SERVICE_UNAVAILABLE";
            message = "The requested service is temporarily unavailable. Please try again.";
        } else if (throwable.getMessage() != null && throwable.getMessage().contains("401")) {
            status = HttpStatus.UNAUTHORIZED;
            code = "UNAUTHORIZED";
            message = "Authentication required.";
        } else if (throwable.getMessage() != null && throwable.getMessage().contains("403")) {
            status = HttpStatus.FORBIDDEN;
            code = "FORBIDDEN";
            message = "You do not have permission to access this resource.";
        } else if (throwable.getMessage() != null && throwable.getMessage().contains("404")) {
            status = HttpStatus.NOT_FOUND;
            code = "NOT_FOUND";
            message = "The requested resource was not found.";
        }

        // Log the real error internally (not sent to client)
        log.error("[{}] Gateway error: {} - {}", requestId, exceptionName, throwable.getMessage());

        ApiError apiError = ApiError.builder()
                .timestamp(Instant.now().toString())
                .status(status.value())
                .code(code)
                .message(message)
                .path(path)
                .requestId(requestId)
                .build();

        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        try {
            byte[] bytes = objectMapper.writeValueAsBytes(apiError);
            DataBuffer buffer = response.bufferFactory().wrap(bytes);
            return response.writeWith(Mono.just(buffer));
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize error response", e);
            return response.setComplete();
        }
    }
}
