package com.comicverse.notification.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNull;

class FcmServiceTest {

    @Test
    void sendToDevice_UnconfiguredFcm_GracefullyDegrades() {
        FcmService fcmService = new FcmService();
        // Without initializing credentials, sendToDevice must return null gracefully without crashing
        String result = fcmService.sendToDevice("dummy-token", "Test Title", "Test Body", null);
        assertNull(result, "Unconfigured FCM should return null message ID without throwing exception");
    }

    @Test
    void sendToUser_DoesNotThrow() {
        FcmService fcmService = new FcmService();
        assertDoesNotThrow(() -> fcmService.sendToUser(1L, "Title", "Body"));
    }
}
