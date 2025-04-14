package com.dct.parkingticket.service;

import com.dct.parkingticket.dto.mapping.IRoleDTO;
import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.CreateRoleRequestDTO;
import com.dct.parkingticket.dto.request.UpdateRoleRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;

import java.util.List;

public interface RoleService {

    BaseResponseDTO getRolesWithPaging(BaseRequestDTO request);
    BaseResponseDTO getRoleDetail(Integer roleId);
    BaseResponseDTO getPermissionTree();
    BaseResponseDTO createNewRole(CreateRoleRequestDTO request);
    BaseResponseDTO updateRole(UpdateRoleRequestDTO request);
    BaseResponseDTO deleteRole(Integer roleId);
    List<IRoleDTO> getAccountRoles(Integer accountId);
}
