package com.dct.parkingticket.dto.request;

import com.dct.parkingticket.constants.BaseConstants;
import com.dct.parkingticket.constants.ExceptionConstants;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ChangeAccountPasswordRequestDTO {

    @NotNull(message = ExceptionConstants.ID_NOT_NULL)
    @Min(value = 1, message = ExceptionConstants.ID_INVALID)
    private Integer id;

    @NotBlank(message = ExceptionConstants.PASSWORD_NOT_BLANK)
    @Size(min = 8, message = ExceptionConstants.PASSWORD_MIN_LENGTH)
    @Size(max = 20, message = ExceptionConstants.PASSWORD_MAX_LENGTH)
    @Pattern(regexp = BaseConstants.REGEX.PASSWORD_PATTERN, message = ExceptionConstants.PASSWORD_INVALID)
    private String oldPassword;

    @NotBlank(message = ExceptionConstants.PASSWORD_NOT_BLANK)
    @Size(min = 8, message = ExceptionConstants.PASSWORD_MIN_LENGTH)
    @Size(max = 20, message = ExceptionConstants.PASSWORD_MAX_LENGTH)
    @Pattern(regexp = BaseConstants.REGEX.PASSWORD_PATTERN, message = ExceptionConstants.PASSWORD_INVALID)
    private String newPassword;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
