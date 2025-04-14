package com.dct.parkingticket.web.rest.common;

import com.dct.parkingticket.constants.ExceptionConstants;
import com.dct.parkingticket.constants.HttpStatusConstants;
import com.dct.parkingticket.constants.ResultConstants;
import com.dct.parkingticket.dto.request.AuthRequestDTO;
import com.dct.parkingticket.dto.request.CreateAccountRequestDTO;
import com.dct.parkingticket.dto.request.RegisterRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.entity.Account;
import com.dct.parkingticket.exception.BaseBadRequestException;
import com.dct.parkingticket.service.AccountService;
import com.dct.parkingticket.service.AuthenticationService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("/api/p/common/auth")
public class AuthResource {

    private final AuthenticationService authService;
    private final AccountService accountService;
    private static final String ENTITY_NAME = "AuthResource";

    public AuthResource(AuthenticationService authService, AccountService accountService) {
        this.authService = authService;
        this.accountService = accountService;
    }

    @PostMapping("/register")
    public BaseResponseDTO register(@Valid @RequestBody RegisterRequestDTO requestDTO) {
        CreateAccountRequestDTO accountRequestDTO = new CreateAccountRequestDTO();
        accountRequestDTO.setEmail(requestDTO.getEmail());
        accountRequestDTO.setUsername(requestDTO.getUsername());
        accountRequestDTO.setPassword(requestDTO.getPassword());
        Account account = accountService.createNewAccount(accountRequestDTO);

        if (Objects.isNull(account) || Objects.isNull(account.getId()) || account.getId() < 1)
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.REGISTER_FAILED);

        return BaseResponseDTO.builder()
            .code(HttpStatusConstants.CREATED)
            .success(HttpStatusConstants.STATUS.SUCCESS)
            .message(ResultConstants.REGISTER_SUCCESS)
            .result(account)
            .build();
    }

    @PostMapping("/login")
    public BaseResponseDTO login(@Valid @RequestBody AuthRequestDTO requestDTO, HttpServletResponse response) {
        BaseResponseDTO responseDTO = authService.authenticate(requestDTO);
        String jwt = (String) responseDTO.getResult();
        Cookie secureCookie = authService.createSecureCookie(jwt, requestDTO.getRememberMe());

        response.addCookie(secureCookie); // Send secure cookie with token to client in HttpOnly
        responseDTO.setResult(null); // Clear token in response body

        return responseDTO;
    }

    @PostMapping("/logout")
    public BaseResponseDTO logout(HttpServletResponse response) {
        SecurityContextHolder.getContext().setAuthentication(null);

        // Create cookie with token is null
        Cookie secureCookie = authService.createSecureCookie(null, false);
        secureCookie.setMaxAge(0); // Delete cookies immediately
        response.addCookie(secureCookie); // Send new cookie to client to overwrite old cookie

        return BaseResponseDTO.builder().ok();
    }
}
