package com.dct.parkingticket.config.properties;

import com.dct.parkingticket.constants.PropertiesConstants;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = PropertiesConstants.RABBIT_MQ_PROPERTIES)
public class RabbitMQProperties {

    private String host;
    private int port;
    private String username;
    private String password;
    private String virtualHost;
    private Exchange exchange;
    private Producer producer;
    private Consumer consumer;
    private Map<String, QueueConfig> queues;

    public static class Exchange {
        private String direct;

        public String getDirect() {
            return direct;
        }

        public void setDirect(String direct) {
            this.direct = direct;
        }
    }

    public static class Producer {
        private int replyTimeout;

        public int getReplyTimeout() {
            return replyTimeout;
        }

        public void setReplyTimeout(int replyTimeout) {
            this.replyTimeout = replyTimeout;
        }
    }

    public static class Consumer {
        private int concurrentConsumer;
        private int maxConcurrentConsumer;
        private int prefetchCount;

        public int getConcurrentConsumer() {
            return concurrentConsumer;
        }

        public void setConcurrentConsumer(int concurrentConsumer) {
            this.concurrentConsumer = concurrentConsumer;
        }

        public int getMaxConcurrentConsumer() {
            return maxConcurrentConsumer;
        }

        public void setMaxConcurrentConsumer(int maxConcurrentConsumer) {
            this.maxConcurrentConsumer = maxConcurrentConsumer;
        }

        public int getPrefetchCount() {
            return prefetchCount;
        }

        public void setPrefetchCount(int prefetchCount) {
            this.prefetchCount = prefetchCount;
        }
    }

    public static class QueueConfig {
        private String name;
        private String routingKey;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRoutingKey() {
            return routingKey;
        }

        public void setRoutingKey(String routingKey) {
            this.routingKey = routingKey;
        }
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getVirtualHost() {
        return virtualHost;
    }

    public void setVirtualHost(String virtualHost) {
        this.virtualHost = virtualHost;
    }

    public Exchange getExchange() {
        return exchange;
    }

    public void setExchange(Exchange exchange) {
        this.exchange = exchange;
    }

    public Producer getProducer() {
        return producer;
    }

    public void setProducer(Producer producer) {
        this.producer = producer;
    }

    public Consumer getConsumer() {
        return consumer;
    }

    public void setConsumer(Consumer consumer) {
        this.consumer = consumer;
    }

    public Map<String, QueueConfig> getQueues() {
        return queues;
    }

    public void setQueues(Map<String, QueueConfig> queues) {
        this.queues = queues;
    }
}
