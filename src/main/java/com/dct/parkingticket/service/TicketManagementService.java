package com.dct.parkingticket.service;

import com.dct.parkingticket.dto.esp32.TicketFilterRequestDTO;
import com.dct.parkingticket.dto.esp32.TicketScanLogFilterRequestDTO;
import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.TicketScanLogStatisticRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;

public interface TicketManagementService {

    void scanTicket(String uid);

    BaseResponseDTO createNewTicket();

    BaseResponseDTO getAllTicketsWithPaging(TicketFilterRequestDTO request);

    BaseResponseDTO updateTicketStatus(String uid, String status);

    BaseResponseDTO deleteTicket(String uid);

    BaseResponseDTO getAllScanLogsWithPaging(TicketScanLogFilterRequestDTO request);

    BaseResponseDTO getTicketScanLogsStatistic(TicketScanLogStatisticRequestDTO request);
}
