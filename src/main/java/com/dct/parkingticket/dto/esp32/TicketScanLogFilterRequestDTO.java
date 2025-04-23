package com.dct.parkingticket.dto.esp32;

import com.dct.parkingticket.dto.request.BaseRequestDTO;

public class TicketScanLogFilterRequestDTO extends BaseRequestDTO {

    private String type;
    private String result;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
