package com.comicverse.notification.infrastructure;

/**
 * NotificationSender abstraction.
 *
 * Hides FCM implementation behind this interface.
 * DEV → PROD: Same interface. Swap implementation if needed.
 * Future: Support multiple providers (APNs, email, SMS).
 */
public interface NotificationSender {

    /**
     * Send a push notification to a device token.
     *
     * @param fcmToken   The FCM device token
     * @param title      Notification title
     * @param body       Notification body
     * @param data       Optional key-value data payload
     * @return FCM message ID if successful
     */
    String sendToDevice(String fcmToken, String title, String body, java.util.Map<String, String> data);

    /**
     * Send a notification to all tokens of a user.
     */
    void sendToUser(Long userId, String title, String body);
}
