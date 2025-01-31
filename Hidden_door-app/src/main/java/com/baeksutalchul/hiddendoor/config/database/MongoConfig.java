package com.baeksutalchul.hiddendoor.config.database;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import com.baeksutalchul.hiddendoor.utils.database.AuditorAwareImpl;

@Configuration
@EnableMongoAuditing
public class MongoConfig {
  @Bean
  public AuditorAware<String> auditorAware() {
    return new AuditorAwareImpl();
  }
}
