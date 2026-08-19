package com.comicverse.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

/**
 * Global filter that generates/propagates X-Request-ID and X-Correlation-ID.
 *
 * X-Request-ID:    Unique per HTTP request. Generated if not present.
 * X-Correlation-ID: Traces a logical flow across multiple services/events.
 *                   Preserved from client if provided, otherwise equals X-Request-ID.
 *
 * Both headers are:
 *   1. Forwarded to downstream services
 *   2. Returned to the client in the response
 *   3. Added to MDC for structured logging
 *
 * This is the foundation for distributed tracing in DEV.
 * In PROD, this integrates with OpenTelemetry / AWS X-Ray trace context.
 */
@Component
public class RequestIdFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(RequestIdFilter.class);

    public static final String REQUEST_ID_HEADER = "X-Request-ID";
    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String MDC_REQUEST_ID = "requestId";
    public static final String MDC_CORRELATION_ID = "correlationId";

    // Run first — before any other filters
    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // Generate or preserve request ID
        String requestId = request.getHeaders().getFirst(REQUEST_ID_HEADER);
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }

        // Generate or preserve correlation ID
        String correlationId = request.getHeaders().getFirst(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = requestId; // Default: same as request ID if not provided
        }

        final String finalRequestId = requestId;
        final String finalCorrelationId = correlationId;

        // Mutate request to forward IDs to downstream services
        ServerHttpRequest mutatedRequest = request.mutate()
                .header(REQUEST_ID_HEADER, finalRequestId)
                .header(CORRELATION_ID_HEADER, finalCorrelationId)
                .build();

        // Add IDs to response headers so clients can correlate
        ServerHttpResponse response = exchange.getResponse();
        response.getHeaders().add(REQUEST_ID_HEADER, finalRequestId);
        response.getHeaders().add(CORRELATION_ID_HEADER, finalCorrelationId);

        // Put in MDC for structured logging
        MDC.put(MDC_REQUEST_ID, finalRequestId);
        MDC.put(MDC_CORRELATION_ID, finalCorrelationId);

        log.debug("Incoming request: {} {} requestId={} correlationId={}",
                request.getMethod(), request.getPath(), finalRequestId, finalCorrelationId);

        ServerWebExchange mutatedExchange = exchange.mutate().request(mutatedRequest).build();

        return chain.filter(mutatedExchange)
                .doFinally(signalType -> {
                    MDC.remove(MDC_REQUEST_ID);
                    MDC.remove(MDC_CORRELATION_ID);
                });
    }
}
