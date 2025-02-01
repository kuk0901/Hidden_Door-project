package com.baeksutalchul.hiddendoor.config.application;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class AppConfig {
  @Bean
  public ModelMapper modelMapper() {
    return new ModelMapper();
  }

  @Bean
  public SimpleMongoClientDatabaseFactory mongoClientDatabaseFactory() {
    return new SimpleMongoClientDatabaseFactory(System.getProperty("MONGODB_URI"));
  }

  @Bean
  public MongoTemplate mongoTemplate(SimpleMongoClientDatabaseFactory factory) {
    return new MongoTemplate(factory);
  }
}
