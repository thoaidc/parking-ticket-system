package com.dct.parkingticket.service.mqtt;

import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.MessageChannel;
import org.springframework.stereotype.Service;

@Service
public class MqttProducer {

    private final MessageChannel mqttOutboundChannel;

    public MqttProducer(MessageChannel mqttOutboundChannel) {
        this.mqttOutboundChannel = mqttOutboundChannel;
    }

    public void sendToEsp32(String message) {
        mqttOutboundChannel.send(MessageBuilder.withPayload(message).build());
    }
}
