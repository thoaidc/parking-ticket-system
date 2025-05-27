package com.dct.parkingticket.common.datetime;

import com.dct.parkingticket.common.DateUtils;
import com.dct.parkingticket.constants.DatetimeConstants;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.Objects;

/**
 * A JPA {@link AttributeConverter} implementation to convert between {@link Instant}
 * and its ISO-8601 string representation for persistence in a database.
 * <p>
 * This converter enables automatic transformation of {@code Instant} fields to ISO-compliant
 * string values when storing to the database, and back to {@code Instant} when retrieving.
 * <p>
 * This is especially useful when working with databases like SQLite that do not support
 * native timestamp types and require datetime fields to be stored as strings. <p>
 *
 * Example stored format: {@code 2025-04-20T15:20:30.123Z}
 *
 * @author thoaidc
 */
@Converter
public class InstantStringConverterForSQLite implements AttributeConverter<Instant, String> {

    @Override
    public String convertToDatabaseColumn(Instant instant) {
        if (Objects.isNull(instant)) {
            instant = Instant.now();
        }

        return DateUtils.ofInstant(instant).toStringWithZoneID(DatetimeConstants.ZoneID.ASIA_HO_CHI_MINH);
    }

    @Override
    public Instant convertToEntityAttribute(String dbData) {
        if (StringUtils.hasText(dbData)) {
            return DateUtils
                .ofInstant(dbData, DatetimeConstants.Formatter.DEFAULT, DatetimeConstants.ZoneID.ASIA_HO_CHI_MINH)
                .getInstance();
        }

        return null;
    }
}
