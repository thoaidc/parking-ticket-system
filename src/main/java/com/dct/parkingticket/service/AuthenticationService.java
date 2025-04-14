package com.dct.parkingticket.service;

import com.dct.parkingticket.dto.request.AuthRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import jakarta.servlet.http.Cookie;

public interface AuthenticationService {

    BaseResponseDTO authenticate(AuthRequestDTO authRequestDTO);
    Cookie createSecureCookie(String token, boolean isRememberMe);
}
