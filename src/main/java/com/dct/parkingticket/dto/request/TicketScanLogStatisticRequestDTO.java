package com.dct.parkingticket.dto.request;

import com.dct.parkingticket.constants.Esp32Constants;
import com.dct.parkingticket.constants.ExceptionConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class TicketScanLogStatisticRequestDTO extends BaseRequestDTO {

    @Pattern(regexp = Esp32Constants.TicketScanType.PATTERN, message = ExceptionConstants.INVALID_REQUEST_DATA)
    private String type;

    @NotBlank(message = ExceptionConstants.INVALID_REQUEST_DATA)
    @Pattern(regexp = Esp32Constants.GROUP_TYPE_PATTERN, message = ExceptionConstants.INVALID_REQUEST_DATA)
    private String groupType;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getGroupType() {
        return groupType;
    }

    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }
}
