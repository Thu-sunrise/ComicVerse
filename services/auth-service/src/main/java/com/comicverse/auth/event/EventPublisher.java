package com.comicverse.auth.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import static com.comicverse.auth.config.RabbitMqConfig.*;

/**
 * Event publisher abstraction for Auth Service.
 *
 * Publishes domain events to RabbitMQ topic exchange.
 *
 * DEV → PROD:
 *   To switch to Kafka/MSK, replace RabbitTemplate with KafkaTemplate here.
 *   No business code changes needed.
 *
 * NEVER log event payloads that may contain sensitive user data.
 */
@Component
public class EventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public EventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishUserRegistered(UserRegisteredEvent payload, String correlationId) {
        EventEnvelope<UserRegisteredEvent> envelope = EventEnvelope.of(
                "USER_REGISTERED",
                "auth-service",
                correlationId,
                payload
        );
        publish(MAIN_EXCHANGE, USER_REGISTERED_ROUTING_KEY, envelope);
    }

    public void publishUserUpdated(UserRegisteredEvent payload, String correlationId) {
        EventEnvelope<UserRegisteredEvent> envelope = EventEnvelope.of(
                "USER_UPDATED",
                "auth-service",
                correlationId,
                payload
        );
        publish(MAIN_EXCHANGE, USER_UPDATED_ROUTING_KEY, envelope);
    }

    private void publish(String exchange, String routingKey, EventEnvelope<?> envelope) {
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, envelope);
            log.info("Published event: type={} eventId={} correlationId={}",
                    envelope.eventType(), envelope.eventId(), envelope.correlationId());
        } catch (Exception e) {
            // Log but don't fail the main flow — events are best-effort in DEV
            // In PROD: add retry, circuit breaker, outbox pattern
            log.error("Failed to publish event {}: {}", envelope.eventType(), e.getMessage());
        }
    }
}
