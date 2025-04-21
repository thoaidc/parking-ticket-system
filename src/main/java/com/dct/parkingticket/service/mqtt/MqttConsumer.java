package com.dct.parkingticket.service.mqtt;

import com.dct.parkingticket.common.JsonUtils;
import com.dct.parkingticket.constants.Esp32Constants;
import com.dct.parkingticket.constants.RabbitMQConstants;
import com.dct.parkingticket.dto.esp32.MqttMessageEvent;
import com.dct.parkingticket.dto.esp32.Esp32Request;
import com.dct.parkingticket.service.TicketManagementService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Objects;

@Service
public class MqttConsumer {

    private static final Logger log = LoggerFactory.getLogger(MqttConsumer.class);
    private final TicketManagementService ticketManagementService;
    private final RabbitMQProducer rabbitMQProducer;

    public MqttConsumer(TicketManagementService ticketManagementService,
                        RabbitMQProducer rabbitMQProducer) {
        this.ticketManagementService = ticketManagementService;
        this.rabbitMQProducer = rabbitMQProducer;
    }

    @EventListener
    public void handleMqttMessage(MqttMessageEvent event) {
        log.info("Received MQTT message from topic [{}]: {}", event.getTopic(), event.getPayload());
        processIncomingMessage(event.getPayload());
    }

    @Async
    protected void processIncomingMessage(String message) {
        Esp32Request ticketRequest = JsonUtils.parseJson(message, Esp32Request.class);

        if (Objects.isNull(ticketRequest)) {
            log.warn("Request invalid from ESP32, not found content.");
            return;
        }

        switch (ticketRequest.getAction()) {
            case Esp32Constants.RequestAction.SCAN_TICKET_NFC -> {
                String UID = ticketRequest.getMessage();

                if (StringUtils.hasText(UID) && UID.length() == 6) {
                    ticketManagementService.scanTicket(UID);
                } else {
                    log.error("Invalid UID when scan ticket: {}", UID);
                }
            }

            case Esp32Constants.RequestAction.RESPONSE_RESULT_WRITE_NFC -> {
                log.info("Response result for write NFC: {}", ticketRequest.getMessage());
                rabbitMQProducer.sendMessage(RabbitMQConstants.RoutingKey.NOTIFICATION, ticketRequest.getMessage());
            }
        }
    }
}
