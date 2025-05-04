package com.dct.parkingticket.service.impl;

import com.dct.parkingticket.config.properties.Security;
import com.dct.parkingticket.constants.ExceptionConstants;
import com.dct.parkingticket.constants.HttpStatusConstants;
import com.dct.parkingticket.constants.ResultConstants;
import com.dct.parkingticket.constants.SecurityConstants;
import com.dct.parkingticket.dto.auth.BaseAuthTokenDTO;
import com.dct.parkingticket.dto.request.AuthRequestDTO;
import com.dct.parkingticket.dto.response.AuthenticationResponseDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.entity.Account;
import com.dct.parkingticket.exception.BaseAuthenticationException;
import com.dct.parkingticket.exception.BaseBadRequestException;
import com.dct.parkingticket.security.jwt.JwtProvider;
import com.dct.parkingticket.security.model.CustomUserDetails;
import com.dct.parkingticket.service.AuthenticationService;

import jakarta.servlet.http.Cookie;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationServiceImpl.class);
    private static final String ENTITY_NAME = "AuthenticationServiceImpl";
    private final AuthenticationManager authenticationManager;
    private final JwtProvider tokenProvider;
    private final Security security;

    public AuthenticationServiceImpl(JwtProvider tokenProvider,
                                     AuthenticationManager authenticationManager,
                                     @Qualifier("security") Security security) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.security = security;
    }

    private Authentication authenticate(String username, String rawPassword) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, rawPassword);

        try {
            return authenticationManager.authenticate(token);
        } catch (UsernameNotFoundException e) {
            log.error("[{}] Account '{}' does not exists", e.getClass().getSimpleName(), username);
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_NOT_FOUND);
        } catch (DisabledException e) {
            log.error("[{}] - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_DISABLED);
        } catch (LockedException e) {
            log.error("[{}] - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_LOCKED);
        } catch (AccountExpiredException e) {
            log.error("[{}] - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_EXPIRED);
        } catch (CredentialsExpiredException e) {
            log.error("[{}] - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.CREDENTIALS_EXPIRED);
        } catch (BadCredentialsException e) {
            log.error("[{}] - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.BAD_CREDENTIALS);
        } catch (AuthenticationException e) {
            log.error("[{}] Authentication failed: {}", e.getClass().getSimpleName(), e.getMessage());
            throw new BaseAuthenticationException(ENTITY_NAME, ExceptionConstants.UNAUTHORIZED);
        }
    }

    @Override
    @Transactional
    public BaseResponseDTO authenticate(AuthRequestDTO authRequestDTO) {
        log.debug("Authenticating user: {}", authRequestDTO.getUsername());
        String username = authRequestDTO.getUsername().trim();
        String rawPassword = authRequestDTO.getPassword().trim();

        Authentication authentication = authenticate(username, rawPassword);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Account account = userDetails.getAccount();
        AuthenticationResponseDTO results = new AuthenticationResponseDTO();
        BeanUtils.copyProperties(account, results);
        results.setAuthorities(userDetails.getSetAuthorities());

        BaseAuthTokenDTO authTokenDTO = BaseAuthTokenDTO.builder()
            .authentication(authentication)
            .userId(account.getId())
            .username(account.getUsername())
            .rememberMe(authRequestDTO.getRememberMe())
            .build();

        String jwtToken = tokenProvider.createToken(authTokenDTO);
        results.setToken(jwtToken);

        return BaseResponseDTO.builder()
            .code(HttpStatusConstants.ACCEPTED)
            .message(ResultConstants.LOGIN_SUCCESS)
            .success(HttpStatusConstants.STATUS.SUCCESS)
            .result(results)
            .build();
    }

    @Override
    public Cookie createSecureCookie(String token, boolean isRememberMe) {
        long tokenValidityInMilliseconds = isRememberMe
            ? security.getTokenValidityForRememberMe()
            : security.getTokenValidity();

        Cookie tokenCookie = new Cookie(SecurityConstants.COOKIES.HTTP_ONLY_COOKIE_ACCESS_TOKEN, token);
        tokenCookie.setHttpOnly(true); // Prevent access by Javascript
        tokenCookie.setSecure(security.isEnabledTls()); // Set true for HTTPS protocol only
        tokenCookie.setPath("/"); // Apply for all requests
        tokenCookie.setMaxAge((int) (tokenValidityInMilliseconds / 1000L));
        tokenCookie.setAttribute("SameSite", "Lax"); // Avoid CSRF but still allow requests from subdomains

        return tokenCookie;
    }
}
