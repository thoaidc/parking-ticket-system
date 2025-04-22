package com.dct.parkingticket.dto.mapping;

public class TicketScanLogStatisticDTO {

    private String time;
    private int totalLogSuccess;
    private int totalLogError;

    public TicketScanLogStatisticDTO(String time, int totalLogSuccess, int totalLogError) {
        this.time = time;
        this.totalLogSuccess = totalLogSuccess;
        this.totalLogError = totalLogError;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getTotalLogSuccess() {
        return totalLogSuccess;
    }

    public void setTotalLogSuccess(int totalLogSuccess) {
        this.totalLogSuccess = totalLogSuccess;
    }

    public int getTotalLogError() {
        return totalLogError;
    }

    public void setTotalLogError(int totalLogError) {
        this.totalLogError = totalLogError;
    }
}
