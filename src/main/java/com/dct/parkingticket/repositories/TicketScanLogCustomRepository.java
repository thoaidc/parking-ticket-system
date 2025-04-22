package com.dct.parkingticket.repositories;

import com.dct.parkingticket.dto.mapping.TicketScanLogStatisticDTO;
import com.dct.parkingticket.dto.request.TicketScanLogStatisticRequestDTO;

import java.util.List;

public interface TicketScanLogCustomRepository {

    List<TicketScanLogStatisticDTO> getLogStats(TicketScanLogStatisticRequestDTO ticketScanLogStatisticRequest);
}
