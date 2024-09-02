package com.vision_x.vision_x.message.service;

import java.util.Map;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.vision_x.vision_x.message.dto.CityGmlMessage;
import com.vision_x.vision_x.message.dto.CsvTopicMessage;
import com.vision_x.vision_x.message.dto.RasterTopicMessage;
import com.vision_x.vision_x.message.dto.ShpFilterMessage;

@Service
public class TopicMessageService {
	
	@Value("#{globalInfo['global.rabbitmq.exchange']}")
	private String exchange;
	
	@Value("#{globalInfo['global.rabbitmq.single.queue']}")
	private String singleQueue;
	
	@Value("#{globalInfo['global.rabbitmq.multi.queue']}")
	private String multiQueue;
	
	@Value("#{globalInfo['global.rabbitmq.single.route']}")
	private String routeSingle;
	
	@Value("#{globalInfo['global.rabbitmq.multi.route']}")
	private String routeMulti;
	
	@Autowired
	private RabbitTemplate rabbitTemplate;
	
	public boolean addSingleBandQueue(Map<String, Object> message, String routingKey) {
		
		boolean result = false;
		
		String routeKey = "raster.band.single."+routingKey;
		
		rabbitTemplate.convertAndSend(exchange,routeKey,message);
		
		result=true;
		
		return result;
	}
	
	public boolean addMetadata(Map<String, Object> message) {
		
		boolean result = false;
		
		String routeKey = "raster.info.metadata";
		
		rabbitTemplate.convertAndSend(exchange, routeKey, message);
		
		result= true;
		
		return result;
	}
	
	public boolean sendCsvConverter(CsvTopicMessage message) {
		boolean result = false;
		
		rabbitTemplate.convertAndSend("csv.exchange","csv.convert.queue.start",message);
		result = true;
		return result;
	}
	
	public boolean sendCsvFilter(CsvTopicMessage message) {

		boolean result = false;
		
		rabbitTemplate.convertAndSend("csv.exchange","csv.filter.start",message);
		
		result = true;
		
		return result;
	}
	
	public boolean sendCityGmlConvert(CityGmlMessage message) {
		
		boolean result = false;
		
		rabbitTemplate.convertAndSend("citygml.exchange","citygml.process.convert",message);
		
		result = true;
		
		return result;
		
	}
	
	public boolean sendShpFilter(ShpFilterMessage message) {
		
		boolean result = false;
		
		rabbitTemplate.convertAndSend("shp.exchange","shp.filter.check",message);
		
		result = true;
		
		return result;
		
	}
	
	
}
