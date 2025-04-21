package com.dct.parkingticket.dto.esp32;

import java.time.LocalDateTime;

public class MqttMessageEvent {

    private final String topic;
    private final String payload;
    private final LocalDateTime timestamp;

    public MqttMessageEvent(String topic, Object payload) {
        this.topic = topic;
        this.payload = payload.toString();
        this.timestamp = LocalDateTime.now();
    }

    public String getTopic() {
        return topic;
    }

    public String getPayload() {
        return payload;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
