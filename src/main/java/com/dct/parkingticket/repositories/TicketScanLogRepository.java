package com.dct.parkingticket.repositories;

import com.dct.parkingticket.dto.mapping.ITicketScanLogDTO;
import com.dct.parkingticket.entity.TicketScanLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketScanLogRepository extends JpaRepository<TicketScanLog, Integer>, TicketScanLogCustomRepository {

    @Query(
        value = "SELECT * FROM ticket_scan_log WHERE uid = ?1 AND result = ?2 ORDER BY scan_time DESC LIMIT 1",
        nativeQuery = true
    )
    Optional<TicketScanLog> findTopByUidAndResultOrderByScanTimeDesc(String uid, String result);

    @Query(
        value = """
            SELECT t.uid, t.type, t.result, t.message, t.scan_time as scanTime
            FROM ticket_scan_log t
            WHERE (:type IS NULL OR t.type = :type)
                AND (:result IS NULL OR t.result = :result)
                AND (:fromDate IS NULL OR t.scan_time >= :fromDate)
                AND (:toDate IS NULL OR t.scan_time <= :toDate)
            ORDER BY t.scan_time DESC
        """,
        nativeQuery = true
    )
    Page<ITicketScanLogDTO> findAllWithPaging(
        @Param("type") String type,
        @Param("result") String result,
        @Param("fromDate") String fromDate,
        @Param("toDate") String toDate,
        Pageable pageable
    );

    @Query(
        value = """
            SELECT t.uid, t.type, t.result, t.message, t.scan_time as scanTime
            FROM ticket_scan_log t
            WHERE (:type IS NULL OR t.type = :type)
                AND (:result IS NULL OR t.result = :result)
                AND (:fromDate IS NULL OR t.scan_time >= :fromDate)
                AND (:toDate IS NULL OR t.scan_time <= :toDate)
            ORDER BY t.scan_time DESC
            LIMIT 20
        """,
        nativeQuery = true
    )
    List<ITicketScanLogDTO> findAllNonPaging(
        @Param("type") String type,
        @Param("result") String result,
        @Param("fromDate") String fromDate,
        @Param("toDate") String toDate
    );
}
