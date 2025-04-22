package com.dct.parkingticket.service.impl;

import com.dct.parkingticket.common.Common;
import com.dct.parkingticket.common.JsonUtils;
import com.dct.parkingticket.constants.Esp32Constants;
import com.dct.parkingticket.constants.ExceptionConstants;
import com.dct.parkingticket.dto.esp32.Message;
import com.dct.parkingticket.dto.mapping.ITicketDTO;
import com.dct.parkingticket.dto.mapping.ITicketScanLogDTO;
import com.dct.parkingticket.dto.mapping.TicketScanLogStatisticDTO;
import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.TicketScanLogStatisticRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.entity.Ticket;
import com.dct.parkingticket.entity.TicketScanLog;
import com.dct.parkingticket.exception.BaseBadRequestException;
import com.dct.parkingticket.repositories.TicketRepository;
import com.dct.parkingticket.repositories.TicketScanLogRepository;
import com.dct.parkingticket.service.TicketManagementService;
import com.dct.parkingticket.service.mqtt.MqttProducer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TicketManagementServiceImpl implements TicketManagementService {

    private static final Logger log = LoggerFactory.getLogger(TicketManagementServiceImpl.class);
    private static final String ENTITY_NAME = "TicketManagementServiceImpl";
    private final TicketRepository ticketRepository;
    private final TicketScanLogRepository ticketScanLogRepository;
    private final MqttProducer mqttProducer;

    public TicketManagementServiceImpl(TicketRepository ticketRepository,
                                       TicketScanLogRepository ticketScanLogRepository,
                                       MqttProducer mqttProducer) {
        this.ticketRepository = ticketRepository;
        this.ticketScanLogRepository = ticketScanLogRepository;
        this.mqttProducer = mqttProducer;
    }

    @Override
    public void scanTicket(String uid) {
        Optional<Ticket> ticketOptional = ticketRepository.findByUid(uid);
        Message message = new Message();

        if (ticketOptional.isEmpty()) {
            message.setAction(Esp32Constants.Action.READ_TICKET_NOT_FOUND);
            message.setMessage(Esp32Constants.Response.TICKET_NOT_FOUND);
            saveTicketScanLog(uid, Esp32Constants.Response.TICKET_NOT_FOUND);
            mqttProducer.sendToEsp32(JsonUtils.toJsonString(message));
            return;
        }

        Ticket ticket = ticketOptional.get();

        switch (ticket.getStatus()) {
            case Esp32Constants.TicketStatus.ACTIVE -> {
                message.setAction(Esp32Constants.Action.READ_TICKET_ACTIVE);
                message.setMessage(Esp32Constants.Response.TICKET_ACTIVE);
                saveTicketScanLog(uid, null);
            }

            case Esp32Constants.TicketStatus.LOCKED -> {
                message.setAction(Esp32Constants.Action.READ_TICKET_LOCKED);
                message.setMessage(Esp32Constants.Response.TICKET_LOCKED);
                saveTicketScanLog(uid, Esp32Constants.Response.TICKET_LOCKED);
            }

            case Esp32Constants.TicketStatus.EXPIRED -> {
                message.setAction(Esp32Constants.Action.READ_TICKET_EXPIRED);
                message.setMessage(Esp32Constants.Response.TICKET_EXPIRED);
                saveTicketScanLog(uid, Esp32Constants.Response.TICKET_EXPIRED);
            }

            default -> {
                message.setAction(Esp32Constants.Action.READ_TICKET_INVALID);
                message.setMessage(Esp32Constants.Response.TICKET_INVALID);
                saveTicketScanLog(uid, Esp32Constants.Response.TICKET_INVALID);
            }
        }

        mqttProducer.sendToEsp32(JsonUtils.toJsonString(message));
    }

    @Override
    public void writeUidToNFC(String uid) {
        Message message = new Message();
        message.setAction(Esp32Constants.Action.WRITE_NFC);
        message.setMessage(uid);
        mqttProducer.sendToEsp32(JsonUtils.toJsonString(message));
    }

    @Async
    protected void saveTicketScanLog(String uid, String error) {
        Optional<TicketScanLog> lastScanLogOpt = ticketScanLogRepository.findTopByUidAndResultOrderByScanTimeDesc(
            uid,
            Esp32Constants.TicketScanResult.VALID
        );

        TicketScanLog newLog = new TicketScanLog();
        String scanType = Esp32Constants.TicketScanType.CHECKIN;
        String scanResult = Esp32Constants.TicketScanResult.VALID;

        if (StringUtils.hasText(error)) {
            newLog.setMessage(error);
            scanResult = Esp32Constants.TicketScanResult.ERROR;
        }

        if (lastScanLogOpt.isPresent()) {
            TicketScanLog lastScanLog = lastScanLogOpt.get();

            if (Esp32Constants.TicketScanType.CHECKIN.equals(lastScanLog.getType())) {
                scanType = Esp32Constants.TicketScanType.CHECKOUT;
            }
        }

        newLog.setUid(uid);
        newLog.setType(scanType);
        newLog.setResult(scanResult);
        newLog.setScanTime(Instant.now());
        ticketScanLogRepository.save(newLog);

        log.info("Saved scan log: uid={}, type={}, result={}, error={}", uid, scanType, scanResult, error);
    }

    @Override
    @Transactional
    public BaseResponseDTO createNewTicket() {
        Ticket ticket = new Ticket();
        String uid = Common.generateUniqueUid();

        while (ticketRepository.existsByUid(uid)) {
            uid = Common.generateUniqueUid();
        }

        ticket.setUid(uid);
        ticket.setStatus(Esp32Constants.TicketStatus.ACTIVE);
        ticketRepository.save(ticket);

        return BaseResponseDTO.builder().ok(ticket);
    }

    @Override
    public BaseResponseDTO getAllTicketsWithPaging(BaseRequestDTO request) {
        if (request.getPageable().isPaged()) {
            Page<ITicketDTO> ticketsWithPaged = ticketRepository.findAllWithPaging(request.getPageable());
            List<ITicketDTO> tickets = ticketsWithPaged.getContent();
            return BaseResponseDTO.builder().total(ticketsWithPaged.getTotalElements()).ok(tickets);
        }

        return BaseResponseDTO.builder().ok(ticketRepository.findAllNonPaging());
    }

    @Override
    @Transactional
    public BaseResponseDTO updateTicketStatus(String uid, String status) {
        ticketRepository.updateTicketStatus(uid, status);
        return BaseResponseDTO.builder().ok();
    }

    @Override
    @Transactional
    public BaseResponseDTO deleteTicket(String uid) {
        if (Objects.isNull(uid)) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.INVALID_REQUEST_DATA);
        }

        ticketRepository.updateTicketStatus(uid, Esp32Constants.TicketStatus.DELETED);
        return BaseResponseDTO.builder().ok();
    }

    @Override
    public BaseResponseDTO getAllScanLogsWithPaging(BaseRequestDTO request) {
        if (request.getPageable().isPaged()) {
            Page<ITicketScanLogDTO> logsWithPaged = ticketScanLogRepository.findAllWithPaging(request.getPageable());
            List<ITicketScanLogDTO> logs = logsWithPaged.getContent();
            return BaseResponseDTO.builder().total(logsWithPaged.getTotalElements()).ok(logs);
        }

        return BaseResponseDTO.builder().ok(ticketScanLogRepository.findAllNonPaging());
    }

    @Override
    public BaseResponseDTO getTicketScanLogsStatistic(TicketScanLogStatisticRequestDTO request) {
        List<TicketScanLogStatisticDTO> results = ticketScanLogRepository.getLogStats(request);
        return BaseResponseDTO.builder().ok(results);
    }
}
