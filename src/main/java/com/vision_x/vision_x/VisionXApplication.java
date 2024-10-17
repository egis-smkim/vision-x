package com.vision_x.vision_x;

import com.vision_x.vision_x.service.ObjectStorageService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

//@SpringBootApplication
//public class VisionXApplication {
//
//	public static void main(String[] args) {
//		SpringApplication.run(VisionXApplication.class, args);
//	}
//
//}
@SpringBootApplication
@EntityScan(basePackages = "com.vision_x.vision_x.entity")  // 엔티티가 있는 패키지 경로
@EnableJpaRepositories(basePackages = "com.vision_x.vision_x.repository")  // 리포지
@EnableRedisHttpSession
public class VisionXApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {

		return application.sources(VisionXApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(VisionXApplication.class, args);
	}


}

