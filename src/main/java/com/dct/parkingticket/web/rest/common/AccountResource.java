package com.dct.parkingticket.web.rest.common;

import com.dct.parkingticket.aop.annotation.CheckAuthorize;
import com.dct.parkingticket.constants.RoleConstants;
import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.CreateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountStatusRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.service.AccountService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common/accounts")
@CheckAuthorize(authorities = RoleConstants.Account.ACCOUNT)
public class AccountResource {

    private final AccountService accountService;

    public AccountResource(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    @CheckAuthorize(authorities = RoleConstants.Account.VIEW)
    public BaseResponseDTO getAccountsWithPaging(@RequestBody BaseRequestDTO request) {
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

    @PutMapping("/status")
    @CheckAuthorize(authorities = RoleConstants.Account.UPDATE)
    public BaseResponseDTO updateAccountStatus(@Valid @RequestBody UpdateAccountStatusRequestDTO request) {
        return accountService.updateAccountStatus(request);
    }

    @DeleteMapping("/{accountId}")
    @CheckAuthorize(authorities = RoleConstants.Account.DELETE)
    public BaseResponseDTO deleteAccount(@PathVariable Integer accountId) {
        return accountService.deleteAccount(accountId);
    }
}
