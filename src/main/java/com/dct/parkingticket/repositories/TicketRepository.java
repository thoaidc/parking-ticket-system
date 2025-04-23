package com.dct.parkingticket.repositories;

import com.dct.parkingticket.dto.mapping.ITicketDTO;
import com.dct.parkingticket.entity.Ticket;
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
public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    Optional<Ticket> findByUid(String uid);

    boolean existsByUid(String uid);

    @Query(
        value = """
            SELECT t.id, t.status, t.uid, t.created_by as createdBy, t.created_date as createdDate
            FROM ticket t
            WHERE status <> 'DELETED'
                AND (:status IS NULL OR t.status = :status)
                AND (:keyword IS NULL OR t.uid LIKE :keyword)
                AND (:fromDate IS NULL OR t.created_date >= :fromDate)
                AND (:toDate IS NULL OR t.created_date <= :toDate)
            ORDER BY t.created_date DESC
        """,
        nativeQuery = true
    )
    Page<ITicketDTO> findAllWithPaging(
        @Param("status") String status,
        @Param("keyword") String keyword,
        @Param("fromDate") String fromDate,
        @Param("toDate") String toDate,
        Pageable pageable
    );

    @Query(
        value = """
            SELECT t.id, t.status, t.uid, t.created_by as createdBy, t.created_date as createdDate
            FROM ticket t
            WHERE status <> 'DELETED'
                AND (:status IS NULL OR t.status = :status)
                AND (:keyword IS NULL OR t.uid LIKE :keyword)
                AND (:fromDate IS NULL OR t.created_date >= :fromDate)
                AND (:toDate IS NULL OR t.created_date <= :toDate)
            ORDER BY t.created_date DESC
            LIMIT 20
        """,
        nativeQuery = true
    )
    List<ITicketDTO> findAllNonPaging(
        @Param("status") String status,
        @Param("keyword") String keyword,
        @Param("fromDate") String fromDate,
        @Param("toDate") String toDate
    );

    @Modifying
    @Query(value = "UPDATE ticket SET status = ?2 WHERE uid = ?1", nativeQuery = true)
    void updateTicketStatus(String uid, String status);
}
