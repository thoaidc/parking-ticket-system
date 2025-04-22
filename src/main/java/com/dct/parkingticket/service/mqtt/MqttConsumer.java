package com.dct.parkingticket.service.mqtt;

import com.dct.parkingticket.common.JsonUtils;
import com.dct.parkingticket.constants.Esp32Constants;
import com.dct.parkingticket.dto.esp32.FeResponse;
import com.dct.parkingticket.dto.esp32.MqttMessageEvent;
import com.dct.parkingticket.dto.esp32.Esp32Request;
import com.dct.parkingticket.dto.esp32.ResultWriteNFCResponse;
import com.dct.parkingticket.entity.Ticket;
import com.dct.parkingticket.repositories.TicketRepository;
import com.dct.parkingticket.service.TicketManagementService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Objects;

@Service
public class MqttConsumer {

    private static final Logger log = LoggerFactory.getLogger(MqttConsumer.class);
    private static final String FE_TOPIC = "/topic/esp32";
    private final TicketManagementService ticketManagementService;
    private final TicketRepository ticketRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public MqttConsumer(TicketManagementService ticketManagementService,
                        TicketRepository ticketRepository,
                        SimpMessagingTemplate messagingTemplate) {
        this.ticketManagementService = ticketManagementService;
        this.ticketRepository = ticketRepository;
        this.messagingTemplate = messagingTemplate;
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
                String responseJson = ticketRequest.getMessage();
                log.info("Response result for write NFC: {}", responseJson);
                handleResultWriteNFC(responseJson);
            }
        }
    }

    private void handleResultWriteNFC(String responseJson) {
        ResultWriteNFCResponse response = JsonUtils.parseJson(responseJson, ResultWriteNFCResponse.class);

        if (Objects.isNull(response)) {
            log.error("Missing response from ESP32 when write NFC");
            FeResponse feResponse = new FeResponse(false, "Missing response from ESP32 when write NFC");
            messagingTemplate.convertAndSend(FE_TOPIC, JsonUtils.toJsonString(feResponse));
            return;
        }

        if (response.isSuccess()) {
            String uid = response.getUid();

            if (StringUtils.hasText(uid) && uid.length() == 6) {
                Ticket ticket = new Ticket();
                ticket.setUid(uid);
                ticket.setStatus(Esp32Constants.TicketStatus.ACTIVE);
                ticketRepository.save(ticket);
                messagingTemplate.convertAndSend(FE_TOPIC, JsonUtils.toJsonString(new FeResponse(true, "")));
                log.info("Save ticket success after write NFC: {}", uid);
                return;
            }
        }

        log.error("Write NFC failed, UID card maybe null or invalid");
        FeResponse feResponse = new FeResponse(false, "Write NFC failed, UID card maybe null or invalid");
        messagingTemplate.convertAndSend(FE_TOPIC, JsonUtils.toJsonString(feResponse));
    }
}
