package com.dct.parkingticket.entity;

import com.dct.parkingticket.common.datetime.InstantStringConverterForSQLite;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

@Entity
@DynamicInsert // Hibernate only insert the nonnull columns to the database instead of insert the entire table
@DynamicUpdate // Hibernate only updates the changed columns to the database instead of updating the entire table
@Table(name = "ticket_scan_log")
@SuppressWarnings("unused")
public class TicketScanLog implements Serializable {

    // Used to identify the version of the class when performing serialization.
    // Ensures compatibility when serialized data is read from different versions of the class.
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "uid", nullable = false)
    private String uid;

    @Column(name = "type")
    private String type; // Checkin or Checkout

    @Column(name = "result")
    private String result; // valid, error

    @Column(name = "message")
    private String message;

    @Column(name = "scan_time", nullable = false)
    @Convert(converter = InstantStringConverterForSQLite.class)
    private Instant scanTime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getScanTime() {
        return scanTime;
    }

    public void setScanTime(Instant scanTime) {
        this.scanTime = scanTime;
    }
}
