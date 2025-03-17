package com.baeksutalchul.hiddendoor;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

@SpringBootTest
class HiddenDoorAppApplicationTests {

	@Autowired
	private ApplicationContext context;

	@Test
	void contextLoads() {
		// Spring 컨텍스트가 올바르게 로드되는지 확인
	}

	@Test
	void applicationContextTest() {
		// Spring Boot 애플리케이션의 ApplicationContext가 정상적으로 로드되었는지 확인
		// -> ApplicationContext: 애플리케이션의 모든 Bean과 설정을 관리
		assertNotNull(context, "Application context should not be null");
	}
}
