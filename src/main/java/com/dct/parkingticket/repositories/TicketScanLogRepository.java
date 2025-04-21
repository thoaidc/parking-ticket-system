package com.dct.parkingticket.repositories;

import com.dct.parkingticket.dto.mapping.ITicketScanLogDTO;
import com.dct.parkingticket.entity.TicketScanLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketScanLogRepository extends JpaRepository<TicketScanLog, Integer> {

    @Query(
        value = "SELECT * FROM ticket_scan_log WHERE uid = ?1 AND result = ?2 ORDER BY scan_time DESC LIMIT 1",
        nativeQuery = true
    )
    Optional<TicketScanLog> findTopByUidAndResultOrderByScanTimeDesc(String uid, String result);

    @Query(
        value = """
            SELECT t.uid, t.type, t.result, t.message, t.scan_time as scanTime
            FROM ticket_scan_log t
        """,
        nativeQuery = true
    )
    Page<ITicketScanLogDTO> findAllWithPaging(Pageable pageable);

    @Query(
        value = """
             SELECT t.uid, t.type, t.result, t.message, t.scan_time as scanTime
            FROM ticket_scan_log t
        """,
        nativeQuery = true
    )
    List<ITicketScanLogDTO> findAllNonPaging();
}
