package com.dct.parkingticket.web.rest.common;

import com.dct.parkingticket.aop.annotation.CheckAuthorize;
import com.dct.parkingticket.constants.ExceptionConstants;
import com.dct.parkingticket.constants.RoleConstants;
import com.dct.parkingticket.dto.auth.AccountDTO;
import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.ChangeAccountPasswordRequestDTO;
import com.dct.parkingticket.dto.request.CreateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountStatusRequestDTO;
import com.dct.parkingticket.dto.response.AuthenticationResponseDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.exception.BaseBadRequestException;
import com.dct.parkingticket.repositories.PermissionRepository;
import com.dct.parkingticket.service.AccountService;

import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/common/accounts")
@CheckAuthorize(authorities = RoleConstants.Account.ACCOUNT)
public class AccountResource {

    private final AccountService accountService;
    private final PermissionRepository permissionRepository;
    private static final String ENTITY_NAME = "AccountResource";

    public AccountResource(AccountService accountService, PermissionRepository permissionRepository) {
        this.accountService = accountService;
        this.permissionRepository = permissionRepository;
    }

    @GetMapping
    @CheckAuthorize(authorities = RoleConstants.Account.VIEW)
    public BaseResponseDTO getAccountsWithPaging(@ModelAttribute BaseRequestDTO request) {
        return accountService.getAccountsWithPaging(request);
    }

    @GetMapping("/{accountId}")
    @CheckAuthorize(authorities = RoleConstants.Account.VIEW)
    public BaseResponseDTO getAccountDetail(@PathVariable Integer accountId) {
        return accountService.getAccountDetail(accountId);
    }

    @PostMapping
    @CheckAuthorize(authorities = RoleConstants.Account.CREATE)
    public BaseResponseDTO createNewAccount(@Valid @RequestBody CreateAccountRequestDTO request) {
        accountService.createNewAccount(request);
        return BaseResponseDTO.builder().ok();
    }

    @PutMapping
    @CheckAuthorize(authorities = RoleConstants.Account.UPDATE)
    public BaseResponseDTO updateAccount(@Valid @RequestBody UpdateAccountRequestDTO request) {
        return accountService.updateAccount(request);
    }

    @PostMapping("/status")
    public BaseResponseDTO checkAuthenticationStatus() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if (StringUtils.hasText(username)) {
            AccountDTO accountDTO = accountService.findAccountByUsername(username);
            Set<String> authorities = permissionRepository.findAllByAccountId(accountDTO.getId());
            AuthenticationResponseDTO authenticationDTO = new AuthenticationResponseDTO();
            BeanUtils.copyProperties(accountDTO, authenticationDTO);
            authenticationDTO.setAuthorities(authorities);
            return BaseResponseDTO.builder().ok(authenticationDTO);
        }

        throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.BAD_CREDENTIALS);
    }

    @PutMapping("/status")
    @CheckAuthorize(authorities = RoleConstants.Account.UPDATE)
    public BaseResponseDTO updateAccountStatus(@Valid @RequestBody UpdateAccountStatusRequestDTO request) {
        return accountService.updateAccountStatus(request);
    }

    @PutMapping("/passwords")
    @CheckAuthorize(authorities = RoleConstants.Account.UPDATE)
    public BaseResponseDTO changePasswordForAdmin(@Valid @RequestBody ChangeAccountPasswordRequestDTO request) {
        return accountService.changePasswordForAdmin(request);
    }

    @DeleteMapping("/{accountId}")
    @CheckAuthorize(authorities = RoleConstants.Account.DELETE)
    public BaseResponseDTO deleteAccount(@PathVariable Integer accountId) {
        return accountService.deleteAccount(accountId);
    }
}
