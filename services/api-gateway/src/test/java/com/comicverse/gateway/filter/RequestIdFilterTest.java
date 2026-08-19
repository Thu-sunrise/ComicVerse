package com.comicverse.gateway.filter;

import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RequestIdFilterTest {

    @Test
    void testFilterAppliesRequestIdAndCorrelationId() {
        RequestIdFilter filter = new RequestIdFilter();
        MockServerHttpRequest request = MockServerHttpRequest.get("/api/v1/stories").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        GatewayFilterChain chain = mock(GatewayFilterChain.class);
        when(chain.filter(any())).thenReturn(Mono.empty());

        Mono<Void> result = filter.filter(exchange, chain);
        assertNotNull(result);

        String responseRequestId = exchange.getResponse().getHeaders().getFirst("X-Request-ID");
        String responseCorrelationId = exchange.getResponse().getHeaders().getFirst("X-Correlation-ID");

        assertNotNull(responseRequestId, "Response must contain X-Request-ID header");
        assertNotNull(responseCorrelationId, "Response must contain X-Correlation-ID header");
    }
}
