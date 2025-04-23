package com.dct.parkingticket.dto.esp32;

import com.dct.parkingticket.dto.request.BaseRequestDTO;

public class TicketFilterRequestDTO extends BaseRequestDTO {

    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
