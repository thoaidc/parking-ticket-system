package com.dct.parkingticket.service;

import com.dct.parkingticket.dto.auth.AccountDTO;
import com.dct.parkingticket.dto.request.AccountFilterSearchRequestDTO;
import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.ChangeAccountPasswordRequestDTO;
import com.dct.parkingticket.dto.request.CreateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountStatusRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.entity.Account;

public interface AccountService {

    Account createNewAccount(CreateAccountRequestDTO request);
    AccountDTO findAccountByUsername(String username);

    BaseResponseDTO getAccountsWithPaging(AccountFilterSearchRequestDTO request);

    BaseResponseDTO getAccountDetail(Integer accountId);

    BaseResponseDTO updateAccount(UpdateAccountRequestDTO request);

    BaseResponseDTO updateAccountStatus(UpdateAccountStatusRequestDTO request);

    BaseResponseDTO changePasswordForAdmin(ChangeAccountPasswordRequestDTO request);

    BaseResponseDTO deleteAccount(Integer accountId);
}
