package com.dct.parkingticket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.util.StringUtils;
import org.springframework.security.core.context.SecurityContextHolder;

import com.dct.parkingticket.config.CRLFLogConverter;
import com.dct.parkingticket.config.properties.Hikari;
import com.dct.parkingticket.config.properties.Security;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Optional;

@SpringBootApplication
@EnableAsync
@EnableAspectJAutoProxy(proxyTargetClass = true)
@EnableConfigurationProperties({ Hikari.class, Security.class })
public class ParkingTicketApplication {

    private static final Logger log = LoggerFactory.getLogger(ParkingTicketApplication.class);

    /**
     * Main method, used to run the application
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(ParkingTicketApplication.class);
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
        Environment env = app.run(args).getEnvironment();
        logApplicationStartup(env);
    }

    private static void logApplicationStartup(Environment env) {
        String applicationName = env.getProperty("spring.application.name");
        String[] activeProfile = env.getActiveProfiles().length == 0 ? env.getDefaultProfiles() : env.getActiveProfiles();
        String protocol = Optional.ofNullable(env.getProperty("server.ssl.key-store")).map(key -> "https").orElse("http");
        String hostAddress = "localhost";
        String serverPort = env.getProperty("server.port");
        String contextPath = Optional.ofNullable(env.getProperty("server.servlet.context-path"))
                .filter(StringUtils::hasText)
                .orElse("/");

        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            log.warn("The host name could not be determined, using `localhost` as fallback");
        }

        log.info(
                CRLFLogConverter.CRLF_SAFE_MARKER,
                """
                \n----------------------------------------------------------
                \tApplication '{}' is running! Access URLs:
                \tLocal: \t\t{}://localhost:{}{}
                \tExternal: \t{}://{}:{}{}
                \tProfile(s): {}
                \n----------------------------------------------------------
                """,
                applicationName,
                protocol,
                serverPort,
                contextPath,
                protocol,
                hostAddress,
                serverPort,
                contextPath,
                activeProfile
        );
    }
}
