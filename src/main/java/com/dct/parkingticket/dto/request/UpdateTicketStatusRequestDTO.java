package com.dct.parkingticket.dto.request;

import com.dct.parkingticket.constants.Esp32Constants;
import com.dct.parkingticket.constants.ExceptionConstants;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateTicketStatusRequestDTO {

    @Min(value = 1, message = ExceptionConstants.ID_INVALID)
    private String id;

    @NotBlank(message = ExceptionConstants.STATUS_NOT_BLANK)
    @Size(min = 6, max = 6, message = ExceptionConstants.STATUS_NOT_BLANK)
    private String uid;

    @NotBlank(message = ExceptionConstants.STATUS_NOT_BLANK)
    @Pattern(regexp = Esp32Constants.TicketStatus.PATTERN, message = ExceptionConstants.STATUS_INVALID)
    private String status;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
