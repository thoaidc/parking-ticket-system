package com.dct.parkingticket.service;

import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.CreateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountStatusRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.entity.Account;

public interface AccountService {

    Account createNewAccount(CreateAccountRequestDTO request);

    BaseResponseDTO getAccountsWithPaging(BaseRequestDTO request);

    BaseResponseDTO getAccountDetail(Integer accountId);

    BaseResponseDTO updateAccount(UpdateAccountRequestDTO request);

    BaseResponseDTO updateAccountStatus(UpdateAccountStatusRequestDTO request);

    BaseResponseDTO deleteAccount(Integer accountId);
}
