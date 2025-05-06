package com.dct.parkingticket.dto.esp32;

import com.dct.parkingticket.constants.Esp32Constants;
import com.dct.parkingticket.dto.request.BaseRequestDTO;

import java.util.Objects;

public class TicketScanLogFilterRequestDTO extends BaseRequestDTO {

    private String type;
    private String result;

    public String getTypeSearch() {
        if (Objects.nonNull(type) && !type.matches(Esp32Constants.TicketScanType.PATTERN)) {
            return null;
        }

        return type;
    }

    public String getResultTypeSearch() {
        if (Objects.nonNull(result) && !result.matches(Esp32Constants.TicketScanResult.PATTERN)) {
            return null;
        }

        return result;
    }

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
