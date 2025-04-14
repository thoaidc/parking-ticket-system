package com.dct.parkingticket.constants;

/**
 * Contains the prefixes for the config property files <p>
 * Refer to these files in the <a href="">com/dct/nextgen/config/properties</a> directory for more details
 *
 * @author thoaidc
 */
@SuppressWarnings("unused")
public interface PropertiesConstants {

    String HIKARI = "dct-base.datasource.hikari";
    String JPA_PROPERTIES = "dct-base.jpa";
    String SECURITY_CONFIG = "dct-base.security.auth";
    String UPLOAD_RESOURCE_PROPERTIES = "dct-base.resources.upload";
    String RABBIT_MQ_PROPERTIES = "spring.rabbitmq";
}
