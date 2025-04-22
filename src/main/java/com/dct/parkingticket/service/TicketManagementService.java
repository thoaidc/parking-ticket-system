package com.dct.parkingticket.service;

import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.TicketScanLogStatisticRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;

public interface TicketManagementService {

    void scanTicket(String uid);

    void writeUidToNFC(String uid);

    BaseResponseDTO createNewTicket();

    BaseResponseDTO getAllTicketsWithPaging(BaseRequestDTO request);

    BaseResponseDTO updateTicketStatus(String uid, String status);

    BaseResponseDTO deleteTicket(String uid);

    BaseResponseDTO getAllScanLogsWithPaging(BaseRequestDTO request);

    BaseResponseDTO getTicketScanLogsStatistic(TicketScanLogStatisticRequestDTO request);
}
