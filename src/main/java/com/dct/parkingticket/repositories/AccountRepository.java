package com.dct.parkingticket.repositories;

import com.dct.parkingticket.dto.mapping.IAccountDTO;
import com.dct.parkingticket.dto.mapping.IAuthenticationDTO;
import com.dct.parkingticket.entity.Account;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    @Query(
        value = """
            SELECT a.id, a.username, a.fullname, a.email, a.phone, a.status,
                   a.created_by as createdBy, a.created_date as createdDate
            FROM account a
            WHERE status <> 'DELETED'
                AND (:status IS NULL OR a.status = :status)
                AND (:keyword IS NULL OR (a.username LIKE :keyword OR a.fullname LIKE :keyword OR a.email LIKE :keyword))
                AND (:fromDate IS NULL OR a.created_date >= :fromDate)
                AND (:toDate IS NULL OR a.created_date <= :toDate)
            ORDER BY a.created_date DESC
        """,
        nativeQuery = true
    )
    Page<IAccountDTO> findAllWithPaging(
        @Param("status") String status,
        @Param("keyword") String keyword,
        @Param("fromDate") String fromDate,
        @Param("toDate") String toDate,
        Pageable pageable
    );

    @Query(
        value = """
            SELECT a.id, a.username, a.fullname, a.email, a.phone, a.status,
                   a.created_by as createdBy, a.created_date as createdDate
            FROM account a
            WHERE status <> 'DELETED'
                AND (:status IS NULL OR a.status = :status)
                AND (:keyword IS NULL OR (a.username LIKE :keyword OR a.fullname LIKE :keyword OR a.email LIKE :keyword))
                AND (:fromDate IS NULL OR a.created_date >= :fromDate)
                AND (:toDate IS NULL OR a.created_date <= :toDate)
            ORDER BY a.created_date DESC
            LIMIT 20
        """,
        nativeQuery = true
    )
    List<IAccountDTO> findAllNonPaging(
        @Param("status") String status,
        @Param("keyword") String keyword,
        @Param("fromDate") String fromDate,
        @Param("toDate") String toDate
    );

    @Query(
        value = """
            SELECT id, email, fullname, device_id as deviceId, status
            FROM account
            WHERE username = ?1 AND status <> 'DELETED'
        """,
        nativeQuery = true
    )
    Optional<IAccountDTO> findByAccountByUsername(String username);

    @Query(
        value = """
            SELECT a.id, a.username, a.password, a.email, a.status, a.device_id as deviceId
            FROM account a WHERE a.username = ?1 AND status <> 'DELETED'
        """,
        nativeQuery = true
    )
    Optional<IAuthenticationDTO> findAuthenticationByUsername(String username);

    boolean existsByUsernameOrEmail(String username, String email);

    @Query("SELECT COUNT(a.id) FROM Account a WHERE (a.username = ?1 OR a.email = ?2) AND a.id <> ?3")
    long countByUsernameOrEmailAndIdNot(String username, String email, Integer accountId);

    @Modifying
    @Query(value = "UPDATE account SET status = ?2 WHERE id = ?1", nativeQuery = true)
    void updateAccountStatusById(Integer accountId, String status);

    @Modifying
    @Query(value = "UPDATE account SET device_id = ?2 WHERE id = ?1", nativeQuery = true)
    void updateDeviceIdByAccountId(Integer accountId, String deviceId);
}
