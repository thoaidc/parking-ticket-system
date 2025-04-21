package com.dct.parkingticket.service.mqtt;

import com.dct.parkingticket.dto.esp32.MqttMessageEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MqttConsumer {

    private static final Logger log = LoggerFactory.getLogger(MqttConsumer.class);
    private static final String ENTITY_NAME = "MqttConsumer";

    @EventListener
    public void handleMqttMessage(MqttMessageEvent event) {
        log.info("Received MQTT message from topic [{}]: {}", event.getTopic(), event.getPayload());
        processIncomingMessage(event.getPayload());
    }

    @Async
    protected void processIncomingMessage(String message) {
        try {
            log.info("Parsed message: {}", message);

        } catch (Exception e) {
            log.error("[{}] - Error processing MQTT message", ENTITY_NAME, e);
        }
    }
}
