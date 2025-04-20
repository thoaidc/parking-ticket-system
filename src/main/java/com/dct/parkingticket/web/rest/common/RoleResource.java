package com.dct.parkingticket.web.rest.common;

import com.dct.parkingticket.aop.annotation.CheckAuthorize;
import com.dct.parkingticket.constants.RoleConstants;
import com.dct.parkingticket.dto.request.BaseRequestDTO;
import com.dct.parkingticket.dto.request.CreateRoleRequestDTO;
import com.dct.parkingticket.dto.request.UpdateRoleRequestDTO;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.service.RoleService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common/roles")
@CheckAuthorize(authorities = RoleConstants.Role.ROLE)
public class RoleResource {

    private final RoleService roleService;

    public RoleResource(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    @CheckAuthorize(authorities = RoleConstants.Role.VIEW)
    public BaseResponseDTO getAllRolesWithPaging(@ModelAttribute BaseRequestDTO request) {
        return roleService.getRolesWithPaging(request);
    }

    @GetMapping("/{roleID}")
    @CheckAuthorize(authorities = RoleConstants.Role.VIEW)
    public BaseResponseDTO getRoleDetail(@PathVariable Integer roleID) {
        return roleService.getRoleDetail(roleID);
    }

    @GetMapping("/permissions")
    @CheckAuthorize(authorities = RoleConstants.Role.VIEW)
    public BaseResponseDTO getPermissionTree() {
        return roleService.getPermissionTree();
    }

    @PostMapping
    @CheckAuthorize(authorities = RoleConstants.Role.CREATE)
    public BaseResponseDTO createNewRole(@Valid @RequestBody CreateRoleRequestDTO requestDTO) {
        return roleService.createNewRole(requestDTO);
    }

    @PutMapping
    @CheckAuthorize(authorities = RoleConstants.Role.UPDATE)
    public BaseResponseDTO updateRole(@Valid @RequestBody UpdateRoleRequestDTO requestDTO) {
        return roleService.updateRole(requestDTO);
    }

    @DeleteMapping("/{roleID}")
    @CheckAuthorize(authorities = RoleConstants.Role.DELETE)
    public BaseResponseDTO deleteRole(@PathVariable Integer roleID) {
        return roleService.deleteRole(roleID);
    }
}
