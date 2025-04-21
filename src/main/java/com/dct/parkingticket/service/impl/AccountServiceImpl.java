package com.dct.parkingticket.service.impl;

import com.dct.parkingticket.common.Common;
import com.dct.parkingticket.constants.AccountConstants;
import com.dct.parkingticket.constants.ExceptionConstants;
import com.dct.parkingticket.dto.auth.AccountDTO;
import com.dct.parkingticket.dto.mapping.IAccountDTO;
import com.dct.parkingticket.dto.mapping.IRoleDTO;
import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.ChangeAccountPasswordRequestDTO;
import com.dct.parkingticket.dto.request.CreateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountRequestDTO;
import com.dct.parkingticket.dto.request.UpdateAccountStatusRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.entity.Account;
import com.dct.parkingticket.entity.AccountRole;
import com.dct.parkingticket.entity.Role;
import com.dct.parkingticket.exception.BaseBadRequestException;
import com.dct.parkingticket.repositories.AccountRepository;
import com.dct.parkingticket.repositories.AccountRoleRepository;
import com.dct.parkingticket.repositories.RoleRepository;
import com.dct.parkingticket.service.AccountService;
import com.dct.parkingticket.service.RoleService;

import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService {

    private static final String ENTITY_NAME = "AccountServiceImpl";
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final RoleRepository roleRepository;
    private final AccountRoleRepository accountRoleRepository;

    public AccountServiceImpl(AccountRepository accountRepository,
                              PasswordEncoder passwordEncoder,
                              RoleService roleService,
                              RoleRepository roleRepository,
                              AccountRoleRepository accountRoleRepository) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
        this.roleRepository = roleRepository;
        this.accountRoleRepository = accountRoleRepository;
    }

    @Override
    public BaseResponseDTO getAccountsWithPaging(BaseRequestDTO request) {
        if (request.getPageable().isPaged()) {
            Page<IAccountDTO> accountsWithPaged = accountRepository.findAllWithPaging(request.getPageable());
            List<IAccountDTO> accounts = accountsWithPaged.getContent();
            return BaseResponseDTO.builder().total(accountsWithPaged.getTotalElements()).ok(accounts);
        }

        return BaseResponseDTO.builder().ok(accountRepository.findAllNonPaging());
    }

    @Override
    public BaseResponseDTO getAccountDetail(Integer accountId) {
        Optional<Account> accountOptional = accountRepository.findById(accountId);

        if (accountOptional.isEmpty()) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_NOT_EXISTED);
        }

        Account account = accountOptional.get();
        AccountDTO accountDTO = new AccountDTO();
        BeanUtils.copyProperties(account, accountDTO);
        Common.setAuditingInfo(account, accountDTO);
        accountDTO.setAuthorities(roleService.getAccountRoles(accountId));

        return BaseResponseDTO.builder().ok(accountDTO);
    }

    @Override
    @Transactional
    public Account createNewAccount(CreateAccountRequestDTO request) {
        boolean isExistedAccount = accountRepository.existsByUsernameOrEmail(request.getUsername(), request.getEmail());

        if (isExistedAccount) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_EXISTED);
        }

        String rawPassword = request.getPassword();
        String hashedPassword = passwordEncoder.encode(rawPassword);

        Account account = new Account();
        BeanUtils.copyProperties(request, account);
        account.setPassword(hashedPassword);
        account.setStatus(AccountConstants.STATUS.ACTIVE);
        accountRepository.save(account);

        if (!request.getRoleIds().isEmpty()) {
            List<IRoleDTO> roles = roleRepository.findAllByIds(request.getRoleIds());

            if (roles.isEmpty() || roles.size() != request.getRoleIds().size()) {
                throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ROLE_PERMISSION_INVALID);
            }

            List<AccountRole> accountRoles = new ArrayList<>();
            roles.forEach(role -> accountRoles.add(new AccountRole(account.getId(), role.getId())));
            accountRoleRepository.saveAll(accountRoles);
        }

        return account;
    }

    @Override
    public AccountDTO findAccountByUsername(String username) {
        Optional<IAccountDTO> accountOptional = accountRepository.findByAccountByUsername(username);

        if (accountOptional.isEmpty()) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_NOT_EXISTED);
        }

        AccountDTO accountDTO = new AccountDTO();
        BeanUtils.copyProperties(accountOptional.get(), accountDTO);

        return accountDTO;
    }

    @Override
    @Transactional
    public BaseResponseDTO updateAccount(UpdateAccountRequestDTO request) {
        long existedAccounts = accountRepository.countByUsernameOrEmailAndIdNot(
            request.getUsername(),
            request.getEmail(),
            request.getId()
        );

        if (existedAccounts > 0) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_EXISTED);
        }

        Optional<Account> accountOptional = accountRepository.findById(request.getId());

        if (accountOptional.isEmpty()) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_NOT_EXISTED);
        }

        List<Role> accountRolesForUpdate = roleRepository.findAllById(request.getRoleIds());

        if (accountRolesForUpdate.isEmpty() || accountRolesForUpdate.size() != request.getRoleIds().size()) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ROLE_PERMISSION_INVALID);
        }

        Account account = accountOptional.get();
        BeanUtils.copyProperties(request, account);
        account.setRoles(accountRolesForUpdate);
        accountRepository.save(account);

        return BaseResponseDTO.builder().ok();
    }

    @Override
    @Transactional
    public BaseResponseDTO updateAccountStatus(UpdateAccountStatusRequestDTO request) {
        accountRepository.updateAccountStatusById(request.getAccountId(), request.getStatus());
        return BaseResponseDTO.builder().ok();
    }

    @Override
    public BaseResponseDTO changePasswordForAdmin(ChangeAccountPasswordRequestDTO request) {
        Optional<Account> accountOptional = accountRepository.findById(request.getId());

        if (accountOptional.isEmpty()) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.ACCOUNT_NOT_EXISTED);
        }

        Account account = accountOptional.get();
        String oldPassword = account.getPassword();
        String oldPasswordConfirm = request.getOldPassword();
        String newPassword = request.getNewPassword();

        if (!passwordEncoder.matches(oldPasswordConfirm, oldPassword)) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.OLD_PASSWORD_INVALID);
        }

        if (Objects.equals(oldPasswordConfirm, newPassword)) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.NEW_PASSWORD_DUPLICATED);
        }

        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

        return BaseResponseDTO.builder().ok();
    }

    @Override
    @Transactional
    public BaseResponseDTO deleteAccount(Integer accountId) {
        if (Objects.isNull(accountId) || accountId <= 0) {
            throw new BaseBadRequestException(ENTITY_NAME, ExceptionConstants.INVALID_REQUEST_DATA);
        }

        accountRepository.updateAccountStatusById(accountId, AccountConstants.STATUS.DELETED);
        return BaseResponseDTO.builder().ok();
    }
}
