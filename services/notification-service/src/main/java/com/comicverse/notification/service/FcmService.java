package com.comicverse.notification.service;

import com.comicverse.notification.infrastructure.NotificationSender;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.util.Base64;
import java.util.Map;

/**
 * FCM Service — implements NotificationSender using Firebase Admin SDK.
 *
 * Initialization:
 *   Option 1: FCM_SERVICE_ACCOUNT_PATH — path to JSON file (Docker volume mount)
 *   Option 2: FCM_SERVICE_ACCOUNT_JSON_BASE64 — base64-encoded JSON (env var)
 *
 * NEVER commit Firebase credentials to Git.
 * NEVER log FCM tokens.
 *
 * DEV → PROD: Same Firebase project and SDK. Only credentials injection changes.
 */
@Service
public class FcmService implements NotificationSender {

    private static final Logger log = LoggerFactory.getLogger(FcmService.class);

    @Value("${fcm.service-account-path:}")
    private String serviceAccountPath;

    @Value("${fcm.service-account-json-base64:}")
    private String serviceAccountBase64;

    @Value("${fcm.project-id:comicverse-app}")
    private String projectId;

    private FirebaseMessaging firebaseMessaging;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                GoogleCredentials credentials;

                if (serviceAccountPath != null && !serviceAccountPath.isBlank()) {
                    // Option 1: File path
                    log.info("Initializing FCM with service account file: {}", serviceAccountPath);
                    credentials = GoogleCredentials.fromStream(new FileInputStream(serviceAccountPath))
                            .createScoped("https://www.googleapis.com/auth/firebase.messaging");
                } else if (serviceAccountBase64 != null && !serviceAccountBase64.isBlank()) {
                    // Option 2: Base64-encoded JSON
                    log.info("Initializing FCM with base64-encoded service account");
                    byte[] decoded = Base64.getDecoder().decode(serviceAccountBase64);
                    credentials = GoogleCredentials.fromStream(new ByteArrayInputStream(decoded))
                            .createScoped("https://www.googleapis.com/auth/firebase.messaging");
                } else {
                    log.warn("FCM credentials not configured. Push notifications will be disabled. " +
                             "Set FCM_SERVICE_ACCOUNT_PATH or FCM_SERVICE_ACCOUNT_JSON_BASE64.");
                    return;
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(credentials)
                        .setProjectId(projectId)
                        .build();
                FirebaseApp.initializeApp(options);
                this.firebaseMessaging = FirebaseMessaging.getInstance();
                log.info("Firebase Admin SDK initialized for project: {}", projectId);
            } else {
                this.firebaseMessaging = FirebaseMessaging.getInstance();
            }
        } catch (Exception e) {
            log.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage());
        }
    }

    @Override
    public String sendToDevice(String fcmToken, String title, String body, Map<String, String> data) {
        if (firebaseMessaging == null) {
            log.warn("FCM not initialized — skipping push notification");
            return null;
        }
        try {
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            com.google.firebase.messaging.Message.Builder messageBuilder = com.google.firebase.messaging.Message.builder()
                    .setToken(fcmToken)
                    .setNotification(notification);

            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            String messageId = firebaseMessaging.send(messageBuilder.build());
            log.info("FCM message sent: messageId={}", messageId);
            return messageId;
        } catch (FirebaseMessagingException e) {
            log.error("Failed to send FCM message: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public void sendToUser(Long userId, String title, String body) {
        // TODO: Look up user's device tokens from device_tokens table and send to each
        log.info("sendToUser called for userId={} — implement device token lookup", userId);
    }
}
