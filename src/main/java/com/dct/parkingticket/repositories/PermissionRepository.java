package com.dct.parkingticket.repositories;

import com.dct.parkingticket.dto.mapping.IPermissionDTO;
import com.dct.parkingticket.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {

    @Query(
        value = """
            SELECT p.id, p.name, p.code, p.parent_id as parentId, p.parent_code as parentCode
            FROM permission p
            ORDER BY p.code;
        """,
        nativeQuery = true
    )
    List<IPermissionDTO> findAllByOrderByCodeAsc();

    @Query(
        value = """
            SELECT p.code
            FROM permission p
            JOIN role_permission rp on p.id = rp.permission_id
            JOIN account_role ar on ar.role_id = rp.role_id
            WHERE ar.account_id = ?1
        """,
        nativeQuery = true
    )
    Set<String> findAllByAccountId(Integer accountId);

    @Query(
        value = """
            SELECT p.id
            FROM permission p
            JOIN role_permission rp on p.id = rp.permission_id
            WHERE rp.role_id = ?1
        """,
        nativeQuery = true
    )
    Set<Integer> findAllByRoleId(Integer roleId);

    @Query(value = "SELECT p.id, p.name, p.code FROM permission p WHERE p.id in (?1);", nativeQuery = true)
    List<IPermissionDTO> findAllByIds(Iterable<Integer> permissionIds);
}
