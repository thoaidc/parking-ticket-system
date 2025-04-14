package com.dct.parkingticket.config;

import com.dct.parkingticket.config.properties.RabbitMQProperties;
import com.dct.parkingticket.constants.ExceptionConstants;
import com.dct.parkingticket.exception.BaseBadRequestException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.ConditionalRejectingErrorHandler;
import org.springframework.amqp.rabbit.support.ListenerExecutionFailedException;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.ErrorHandler;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * RabbitMQ configuration class that defines exchanges, queues, bindings,
 * connection factories, message converters, and listener containers
 *
 * @author thoaidc
 */
@Configuration
public class RabbitMQConfig {

    private final RabbitMQProperties rabbitMQConfig;
    private final ObjectMapper objectMapper;
    private static final String ENTITY_NAME = "RabbitMQConfig";

    public RabbitMQConfig(@Qualifier("rabbitMQProperties") RabbitMQProperties rabbitMQProperties,
                          ObjectMapper objectMapper) {
        this.rabbitMQConfig = rabbitMQProperties;
        this.objectMapper = objectMapper;
    }

    /**
     * Defines a direct exchange, where messages are routed based on routingKey
     * @return the {@link DirectExchange} instance
     */
    @Bean
    public DirectExchange directExchange() {
        return new DirectExchange(rabbitMQConfig.getExchange().getDirect());
    }

    /**
     * Creates and registers message queues based on configuration
     * @return a list of {@link Queue}
     */
    @Bean
    public List<Queue> declareQueues() {
        List<Queue> queues = new ArrayList<>();
        boolean durable = true; // The queue persists after RabbitMQ restarts
        boolean exclusive = false; // The queue is not limited to one connection
        boolean autoDelete = false; // Do not automatically delete the queue when there are no more consumers

        for (Map.Entry<String, RabbitMQProperties.QueueConfig> entry : rabbitMQConfig.getQueues().entrySet()) {
            RabbitMQProperties.QueueConfig queueConfig = entry.getValue();
            String queueName = Objects.nonNull(queueConfig) ? queueConfig.getName() : null;

            if (StringUtils.hasText(queueName)) {
                Queue queue = new Queue(queueName, durable, exclusive, autoDelete);
                queues.add(queue);
            }
        }

        return queues;
    }

    /**
     * Defines bindings between queues and the direct exchange <p>
     * Connect queues to Direct Exchange using corresponding routingKey
     * @param directExchange the direct exchange
     * @return a list of {@link Binding}
     */
    @Bean
    public List<Binding> bindingQueues(DirectExchange directExchange) {
        if (Objects.isNull(directExchange)) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.DIRECT_EXCHANGE_NULL);
        }

        List<Binding> bindings = new ArrayList<>();
        List<Queue> queues = declareQueues();

        for (Queue queue : queues) {
            if (Objects.nonNull(queue)) {
                RabbitMQProperties.QueueConfig queueConfig = rabbitMQConfig.getQueues().get(queue.getName());
                String routingKey = Objects.nonNull(queueConfig) ? queueConfig.getRoutingKey() : null;

                if (StringUtils.hasText(routingKey)) {
                    Binding binding = BindingBuilder.bind(queue).to(directExchange).with(routingKey);
                    bindings.add(binding);
                }
            }
        }

        return bindings;
    }

    /**
     * Create a connection to RabbitMQ with the information host, port, username, password, virtualHost
     * @return the {@link ConnectionFactory} instance
     */
    @Primary
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();

        connectionFactory.setHost(rabbitMQConfig.getHost());
        connectionFactory.setPort(rabbitMQConfig.getPort());
        connectionFactory.setUsername(rabbitMQConfig.getUsername());
        connectionFactory.setPassword(rabbitMQConfig.getPassword());
        connectionFactory.setVirtualHost(rabbitMQConfig.getVirtualHost());

        return connectionFactory;
    }

    /**
     * Use {@link Jackson2JsonMessageConverter} to automatically convert messages between JSON and Object
     * @return default {@link MessageConverter} for use
     */
    @Bean
    public MessageConverter defaultMessageConverter() {
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    /**
     * Creates a RabbitMQ template for sending messages
     * @param connectionFactory the connection factory
     * @return the RabbitTemplate instance
     */
    @Primary
    @Bean(name = "customRabbitTemplate")
    public AmqpTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(defaultMessageConverter());
        rabbitTemplate.setReplyTimeout(rabbitMQConfig.getProducer().getReplyTimeout());
        return rabbitTemplate;
    }

    /**
     * Configures the RabbitMQ listener container factory <p>
     * Set the number of Consumers to process concurrently <p>
     * Helps optimize performance by pre-fetching multiple messages <p>
     * Handling errors with {@link RabbitMQConfig#errorHandler()} <p>
     * Manually acknowledge messages ({@link AcknowledgeMode#MANUAL}), which helps avoid data loss if an error occurs
     *
     * @param connectionFactory the connection factory
     * @return the SimpleRabbitListenerContainerFactory instance
     */
    @Primary
    @Bean("rabbitListenerContainerFactory")
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        final SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        // Resend message for reprocessing when a message fails during processing by the consumer
        factory.setDefaultRequeueRejected(true);
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(defaultMessageConverter());
        factory.setConcurrentConsumers(rabbitMQConfig.getConsumer().getConcurrentConsumer());
        factory.setMaxConcurrentConsumers(rabbitMQConfig.getConsumer().getMaxConcurrentConsumer());
        factory.setPrefetchCount(rabbitMQConfig.getConsumer().getPrefetchCount());
        factory.setErrorHandler(errorHandler());
        factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        return factory;
    }

    @Bean
    public ErrorHandler errorHandler() {
        return new ConditionalRejectingErrorHandler(new MyFatalExceptionStrategy());
    }

    public static class MyFatalExceptionStrategy extends ConditionalRejectingErrorHandler.DefaultExceptionStrategy {

        private final Logger log = LoggerFactory.getLogger(MyFatalExceptionStrategy.class);

        @Override
        public boolean isFatal(@Nonnull Throwable error) {
            if (error instanceof ListenerExecutionFailedException exception) {
                String queueName = exception.getFailedMessage().getMessageProperties().getConsumerQueue();
                log.error("Failed to process message from queue: {}", queueName, error);
                log.error("Failed message: {}", exception.getFailedMessage());
            }

            return super.isFatal(error);
        }
    }
}
