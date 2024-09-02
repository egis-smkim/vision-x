package com.vision_x.vision_x;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

//@SpringBootApplication
//public class VisionXApplication {
//
//	public static void main(String[] args) {
//		SpringApplication.run(VisionXApplication.class, args);
//	}
//
//}
@SpringBootApplication
public class VisionXApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(VisionXApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(VisionXApplication.class, args);
	}
}

