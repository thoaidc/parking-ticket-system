package com.dct.parkingticket.repositories;

import com.dct.parkingticket.dto.mapping.ITicketDTO;
import com.dct.parkingticket.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    Optional<Ticket> findByUid(String uid);

    boolean existsByUid(String uid);

    @Query(value = "SELECT t.id, t.status, t.uid FROM ticket t WHERE status <> 'DELETED'", nativeQuery = true)
    Page<ITicketDTO> findAllWithPaging(Pageable pageable);

    @Query(value = "SELECT t.id, t.status, t.uid FROM ticket t WHERE status <> 'DELETED' LIMIT 20", nativeQuery = true)
    List<ITicketDTO> findAllNonPaging();

    @Modifying
    @Query(value = "UPDATE ticket SET status = ?2 WHERE uid = ?1", nativeQuery = true)
    void updateTicketStatus(String uid, String status);
}
