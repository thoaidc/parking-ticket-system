package com.dct.parkingticket.web.mqtt;

import com.dct.parkingticket.constants.RabbitMQConstants;
import com.dct.parkingticket.dto.response.BaseResponseDTO;
import com.dct.parkingticket.service.mqtt.RabbitMQProducer;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common/mqtt")
public class RabbitMQResource {

    private final RabbitMQProducer rabbitMQProducer;

    public RabbitMQResource(RabbitMQProducer rabbitMQProducer) {
        this.rabbitMQProducer = rabbitMQProducer;
    }

    @PostMapping
    public BaseResponseDTO sendMessage() {
        rabbitMQProducer.sendMessage(RabbitMQConstants.RoutingKey.NOTIFICATION, "Hello");
        return BaseResponseDTO.builder().ok();
    }
}
