package com.dct.parkingticket.repositories.impl;

import com.dct.parkingticket.common.DataUtils;
import com.dct.parkingticket.common.DateUtils;
import com.dct.parkingticket.constants.DatetimeConstants;
import com.dct.parkingticket.constants.Esp32Constants;
import com.dct.parkingticket.constants.ExceptionConstants;
import com.dct.parkingticket.dto.mapping.TicketScanLogStatisticDTO;
import com.dct.parkingticket.dto.request.TicketScanLogStatisticRequestDTO;
import com.dct.parkingticket.exception.BaseIllegalArgumentException;
import com.dct.parkingticket.repositories.TicketScanLogCustomRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class TicketScanLogRepositoryImpl implements TicketScanLogCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    private static final String ENTITY_NAME = "TicketScanLogCustomRepositoryImpl";

    @Override
    public List<TicketScanLogStatisticDTO> getLogStats(TicketScanLogStatisticRequestDTO ticketScanLogStatisticRequest) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT ");

        switch (ticketScanLogStatisticRequest.getGroupType()) {
            case "HOURS" -> sql.append("strftime('%H', scan_time) AS time, ");
            case "DAY" -> sql.append("DATE(scan_time) AS time, ");
            case "MONTH" -> sql.append("strftime('%Y-%m', scan_time) AS time, ");
            default -> throw new BaseIllegalArgumentException(ENTITY_NAME, ExceptionConstants.INVALID_REQUEST_DATA);
        }

        sql.append("""
            SUM(CASE WHEN result = :resultValid THEN 1 ELSE 0 END) AS totalLogSuccess,
            SUM(CASE WHEN result = :resultError THEN 1 ELSE 0 END) AS totalLogError
            FROM ticket_scan_log
            WHERE 1=1
        """);

        String fromDate = DateUtils.ofLocalDateTime(
            ticketScanLogStatisticRequest.getFromDate(),
            DatetimeConstants.Formatter.DEFAULT,
            DatetimeConstants.ZoneID.ASIA_HO_CHI_MINH
        ).toString();
        String toDate = DateUtils.ofLocalDateTime(
            ticketScanLogStatisticRequest.getToDate(),
            DatetimeConstants.Formatter.DEFAULT,
            DatetimeConstants.ZoneID.ASIA_HO_CHI_MINH
        ).toString();
        String type = ticketScanLogStatisticRequest.getType();
        Map<String, Object> params = new HashMap<>();
        params.put("resultValid", Esp32Constants.TicketScanResult.VALID);
        params.put("resultError", Esp32Constants.TicketScanResult.ERROR);

        if (StringUtils.hasText(fromDate)) {
            sql.append(" AND scan_time >= :fromDate");
            params.put("fromDate", fromDate);
        }

        if (StringUtils.hasText(toDate)) {
            sql.append(" AND scan_time <= :toDate");
            params.put("toDate", toDate);
        }

        if (StringUtils.hasText(type)) {
            sql.append(" AND type = :type");
            params.put("type", type);
        }

        switch (ticketScanLogStatisticRequest.getGroupType()) {
            case "HOURS" -> sql.append(" GROUP BY strftime('%H', scan_time)");
            case "DAY" -> sql.append(" GROUP BY DATE(scan_time)");
            case "MONTH" -> sql.append(" GROUP BY strftime('%Y-%m', scan_time)");
        }

        sql.append(" ORDER BY time");

        return DataUtils.createQueryBuilder(entityManager)
            .querySql(sql.toString())
            .params(params)
            .getResultsWithDTO(tuple -> new TicketScanLogStatisticDTO(
                tuple.get("time", String.class),
                tuple.get("totalLogSuccess", Integer.class),
                tuple.get("totalLogError", Integer.class)
            ));
    }
}
