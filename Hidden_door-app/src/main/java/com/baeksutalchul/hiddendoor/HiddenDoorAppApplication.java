package com.baeksutalchul.hiddendoor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@EnableScheduling
public class HiddenDoorAppApplication {

	private static final Logger logger = LoggerFactory.getLogger(HiddenDoorAppApplication.class);

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load(); // .env 파일 로드
		System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI"));
		System.setProperty("MONGO_DB_NAME", dotenv.get("MONGO_DB_NAME"));
		System.setProperty("JWT_SECRET_KEY", dotenv.get("JWT_SECRET_KEY"));
		System.setProperty("ADMIN_EMAIL", dotenv.get("ADMIN_EMAIL"));
		System.setProperty("ADMIN_PASSWORD", dotenv.get("ADMIN_PASSWORD"));
		System.setProperty("TEST_ADMIN_EMAIL", dotenv.get("TEST_ADMIN_EMAIL"));
		System.setProperty("TEST_ADMIN_PASSWORD", dotenv.get("TEST_ADMIN_PASSWORD"));
		System.setProperty("GMAIL_USERNAME", dotenv.get("GMAIL_USERNAME"));
		System.setProperty("GMAIL_PASSWORD", dotenv.get("GMAIL_PASSWORD"));

		SpringApplication.run(HiddenDoorAppApplication.class, args);
		logger.info("Hidden_door-app project SpringBoot start...");
	}

}
