package com.dct.parkingticket.constants;

public interface Esp32Constants {

    interface Action {
        int TICKET_ACTIVE = 1;
        int TICKET_LOCKED = 2;
        int TICKET_EXPIRED = 3;
        int TICKET_INVALID = 4;
        int TICKET_NOT_FOUND = 5;
    }

    interface TicketStatus {
        String ACTIVE = "ACTIVE";
        String EXPIRED = "EXPIRED";
        String LOCKED = "LOCKED";
        String DELETED = "DELETED";
        String PATTERN = "^(ACTIVE|EXPIRED|LOCKED|DELETED)$";
    }

    interface RequestAction {
        int SCAN_TICKET_NFC = 1;
        int RESPONSE_RESULT_WRITE_NFC = 2;
    }

    interface Response {
        String TICKET_ACTIVE = "Thẻ hợp lệ";
        String TICKET_LOCKED = "Thẻ bị khóa";
        String TICKET_EXPIRED = "Thẻ đã hết hạn";
        String TICKET_INVALID = "Thẻ không hợp lệ";
        String TICKET_NOT_FOUND = "Không tìm thấy thông tin thẻ";
    }

    interface TicketScanType {
        String CHECKIN = "CHECKIN";
        String CHECKOUT = "CHECKOUT";
    }

    interface TicketScanResult {
        String VALID = "SCAN_VALID";
        String ERROR = "SCAN_ERROR";
    }
}
