package com.dct.parkingticket.dto.request;

public class AccountFilterSearchRequestDTO extends BaseRequestDTO {

    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
