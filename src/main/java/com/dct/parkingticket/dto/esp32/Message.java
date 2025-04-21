package com.dct.parkingticket.dto.esp32;

public class Message {

    private int action;
    private String message;

    public int getAction() {
        return action;
    }

    public void setAction(int action) {
        this.action = action;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
