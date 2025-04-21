package com.dct.parkingticket.config;

import com.dct.parkingticket.dto.esp32.MqttMessageEvent;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

@Configuration
public class MqttConfig {

    private static final Logger log = LoggerFactory.getLogger(MqttConfig.class);
    private static final String ENTITY_NAME = "MqttConfig";

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.client.id:default-client-id}")
    private String clientId;

    @Value("${mqtt.topic.send}")
    private String sendTopic;

    @Value("${mqtt.topic.receive}")
    private String receiveTopic;

    @Value("${mqtt.broker.username}")
    private String username;

    @Value("${mqtt.broker.password}")
    private String password;

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();

        options.setServerURIs(new String[] {brokerUrl});
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        options.setAutomaticReconnect(true);
        options.setCleanSession(false);
        options.setConnectionTimeout(30);
        options.setKeepAliveInterval(45);
        factory.setConnectionOptions(options);

        return factory;
    }

    // Channel receive messages
    @Bean
    public MessageChannel mqttOutboundChannel() {
        return new DirectChannel();
    }

    // Channel send messages
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    // Outbound config (send message to ESP32)
    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannel")
    public MessageHandler mqttOutbound() {
        MqttPahoMessageHandler handler = new MqttPahoMessageHandler(clientId + "-out", mqttClientFactory());
        handler.setAsync(true);
        handler.setDefaultTopic(sendTopic);
        return handler;
    }

    //  Inbound config (receive messages from ESP32)
    @Bean
    public MessageProducer inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
            new MqttPahoMessageDrivenChannelAdapter(clientId + "-in", mqttClientFactory(), receiveTopic);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    // Publish messages receive from Esp32 to other consumer to process
    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler inboundMessageHandler(ApplicationEventPublisher eventPublisher) {
        return message -> {
            try {
                eventPublisher.publishEvent(new MqttMessageEvent(receiveTopic, message.getPayload().toString()));
            } catch (Exception e) {
                log.error("[{}] - Could not published message from topic: {}, ", ENTITY_NAME, receiveTopic, e);
            }
        };
    }
}
