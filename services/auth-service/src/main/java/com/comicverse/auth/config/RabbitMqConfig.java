package com.comicverse.auth.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ infrastructure configuration for Auth Service.
 *
 * Exchange topology:
 *   comicverse.events  — topic exchange (main event bus)
 *   comicverse.dlx     — dead-letter exchange (failed messages)
 *
 * Auth Service publishes:
 *   user.registered  — when a user registers
 *   user.updated     — when user profile is updated
 *
 * Routing keys follow pattern:  {domain}.{event}
 * Example: user.registered, user.updated, story.published
 *
 * DEV → PROD: RabbitMQ → Kafka/MSK
 *   Replace RabbitTemplate usage with a KafkaTemplate.
 *   The EventPublisher abstraction isolates this change to one class.
 */
@Configuration
public class RabbitMqConfig {

    // -------------------------------------------------------
    // Exchange Names
    // -------------------------------------------------------
    public static final String MAIN_EXCHANGE = "comicverse.events";
    public static final String DLX_EXCHANGE  = "comicverse.dlx";

    // -------------------------------------------------------
    // Routing Keys — Auth Service
    // -------------------------------------------------------
    public static final String USER_REGISTERED_ROUTING_KEY = "user.registered";
    public static final String USER_UPDATED_ROUTING_KEY    = "user.updated";

    // -------------------------------------------------------
    // Queue Names
    // -------------------------------------------------------
    public static final String USER_REGISTERED_QUEUE = "auth.user.registered";
    public static final String DLQ_SUFFIX            = ".dlq";

    // -------------------------------------------------------
    // Exchanges
    // -------------------------------------------------------
    @Bean
    public TopicExchange mainExchange() {
        return ExchangeBuilder.topicExchange(MAIN_EXCHANGE)
                .durable(true)
                .build();
    }

    @Bean
    public TopicExchange deadLetterExchange() {
        return ExchangeBuilder.topicExchange(DLX_EXCHANGE)
                .durable(true)
                .build();
    }

    // -------------------------------------------------------
    // Queues
    // -------------------------------------------------------
    @Bean
    public Queue userRegisteredQueue() {
        return QueueBuilder.durable(USER_REGISTERED_QUEUE)
                .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", USER_REGISTERED_ROUTING_KEY + ".dlq")
                .withArgument("x-message-ttl", 300000) // 5 minutes
                .build();
    }

    @Bean
    public Queue userRegisteredDlq() {
        return QueueBuilder.durable(USER_REGISTERED_QUEUE + DLQ_SUFFIX)
                .build();
    }

    // -------------------------------------------------------
    // Bindings
    // -------------------------------------------------------
    @Bean
    public Binding userRegisteredBinding(Queue userRegisteredQueue, TopicExchange mainExchange) {
        return BindingBuilder.bind(userRegisteredQueue)
                .to(mainExchange)
                .with(USER_REGISTERED_ROUTING_KEY);
    }

    @Bean
    public Binding userRegisteredDlqBinding(Queue userRegisteredDlq, TopicExchange deadLetterExchange) {
        return BindingBuilder.bind(userRegisteredDlq)
                .to(deadLetterExchange)
                .with(USER_REGISTERED_ROUTING_KEY + ".dlq");
    }

    // -------------------------------------------------------
    // Message Converter & Template
    // -------------------------------------------------------
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                          MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        template.setMandatory(true); // Return undeliverable messages
        return template;
    }
}
