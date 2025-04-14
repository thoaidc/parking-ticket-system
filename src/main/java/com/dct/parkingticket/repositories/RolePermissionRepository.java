package com.dct.parkingticket.repositories;

import com.dct.parkingticket.entity.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@SuppressWarnings("unused")
public interface RolePermissionRepository extends JpaRepository<RolePermission, Integer> {}
