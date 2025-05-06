package com.dct.parkingticket.constants;

public interface AccountConstants {

    interface STATUS {
        String ACTIVE = "ACTIVE";
        String INACTIVE = "INACTIVE";
        String LOCKED = "LOCKED";
        String DELETED = "DELETED";
        String PATTERN = "^(ACTIVE|INACTIVE|LOCKED|DELETED)$";
    }
}
