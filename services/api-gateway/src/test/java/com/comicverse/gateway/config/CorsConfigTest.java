package com.comicverse.gateway.config;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.cors.reactive.CorsWebFilter;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class CorsConfigTest {

    @Test
    void testCorsWebFilterBeanCreation() {
        CorsConfig corsConfig = new CorsConfig();
        ReflectionTestUtils.setField(corsConfig, "allowedOriginsConfig", "http://localhost:5173,http://localhost:3000");

        CorsWebFilter filter = corsConfig.corsWebFilter();
        assertNotNull(filter, "CorsWebFilter bean must be created successfully");
    }
}
