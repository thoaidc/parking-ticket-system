package com.dct.parkingticket.web.rest;

import com.dct.parkingticket.dto.esp32.TicketFilterRequestDTO;
import com.dct.parkingticket.dto.esp32.TicketScanLogFilterRequestDTO;
import com.dct.parkingticket.dto.request.TicketScanLogStatisticRequestDTO;
import com.dct.parkingticket.dto.request.UpdateTicketStatusRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.service.TicketManagementService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class TicketManagementResource {

    private final TicketManagementService ticketManagementService;

    public TicketManagementResource(TicketManagementService ticketManagementService) {
        this.ticketManagementService = ticketManagementService;
    }

    @GetMapping
    public BaseResponseDTO getAllTicketsWithPaging(@ModelAttribute TicketFilterRequestDTO requestDTO) {
        return ticketManagementService.getAllTicketsWithPaging(requestDTO);
    }

    @PostMapping
    public BaseResponseDTO createNewTicket() {
        return ticketManagementService.createNewTicket();
    }

    @PutMapping("/status")
    public BaseResponseDTO updateTicketStatus(@Valid @RequestBody UpdateTicketStatusRequestDTO requestDTO) {
        return ticketManagementService.updateTicketStatus(requestDTO.getUid(), requestDTO.getStatus());
    }

    @DeleteMapping("/{uid}")
    public BaseResponseDTO deleteTicketByUid(@PathVariable String uid) {
        return ticketManagementService.deleteTicket(uid);
    }

    @GetMapping("/logs")
    public BaseResponseDTO getAllTicketScanLogsWithPaging(@ModelAttribute TicketScanLogFilterRequestDTO requestDTO) {
        return ticketManagementService.getAllScanLogsWithPaging(requestDTO);
    }

    @GetMapping("/logs/statistics")
    public BaseResponseDTO getTicketScanLogsStatistic(@ModelAttribute TicketScanLogStatisticRequestDTO requestDTO) {
        return ticketManagementService.getTicketScanLogsStatistic(requestDTO);
    }
}
