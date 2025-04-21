package com.dct.parkingticket.web.mqtt;

import com.dct.parkingticket.common.JsonUtils;
import com.dct.parkingticket.dto.esp32.Message;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.service.mqtt.MqttProducer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common/mqtt")
public class RabbitMQResource {

    private static final Logger log = LoggerFactory.getLogger(RabbitMQResource.class);
    private final MqttProducer mqttService;

    public RabbitMQResource(MqttProducer mqttService) {
        this.mqttService = mqttService;
    }

    @PostMapping
    public BaseResponseDTO sendMessage(@RequestParam("action") int action, @RequestParam("message") String message) {
        Message mes = new Message();
        mes.setAction(action);
        mes.setMessage(message);

        mqttService.sendToEsp32(JsonUtils.toJsonString(mes));
        log.info("Send to ESP32: " + JsonUtils.toJsonString(mes));

        return BaseResponseDTO.builder().ok();
    }
}
