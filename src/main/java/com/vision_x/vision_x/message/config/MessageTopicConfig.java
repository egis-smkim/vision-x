package com.vision_x.vision_x.message.config;

import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageTopicConfig {

	@Value("#{globalInfo['spring.rabbitmq.host']}")
	private String host;
	
	@Value("#{globalInfo['spring.rabbitmq.port']}")
	private int port;
	
	@Value("#{globalInfo['spring.rabbitmq.username']}")
	private String username;
	
	@Value("#{globalInfo['spring.rabbitmq.password']}")
	private String password;
	
	@Bean
	public ConnectionFactory connectionFactory() {
		 
		CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
		 
		 connectionFactory.setHost(host);
		 connectionFactory.setPort(port);
		 connectionFactory.setUsername(username);
		 connectionFactory.setPassword(password);
		 
		 return connectionFactory;
	}
	
	@Bean
	MessageConverter messageConverter() {
		return new Jackson2JsonMessageConverter();
	}
	
	@Bean
	RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
		
		RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
		rabbitTemplate.setMessageConverter(messageConverter);
		
		return rabbitTemplate;
	}
	
}
