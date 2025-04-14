package com.dct.parkingticket.service.mqtt;

import com.dct.parkingticket.constants.RabbitMQConstants;
import com.rabbitmq.client.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

@Service
@DependsOn("bindingQueues") // Make sure queues are created before Consumer is launched
public class RabbitMQConsumer {

    private final RabbitMQProducer rabbitMQProducer;
    private static final Logger log = LoggerFactory.getLogger(RabbitMQConsumer.class);

    public RabbitMQConsumer(RabbitMQProducer rabbitMQProducer) {
        this.rabbitMQProducer = rabbitMQProducer;
    }

    @RabbitListener(queues = RabbitMQConstants.Queue.NOTIFICATION)
    public void receiveMessage(String message, Channel channel, Message amqpMessage) {
        try {
            // Processed success -> send ack
            log.info("Received message from RabbitMQ: {}", message);
            rabbitMQProducer.confirmProcessed(channel, amqpMessage);
        } catch (Exception e) {
            // Notify error back to RabbitMQ with action requeue messages
            rabbitMQProducer.notifyError(channel, amqpMessage, true);
        }
    }
}
