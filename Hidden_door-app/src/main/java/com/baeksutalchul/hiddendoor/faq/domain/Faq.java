package com.baeksutalchul.hiddendoor.faq.domain;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "faq")
public class Faq {
  @Id
  private String faqId;
  private String writer;
  private String category;
  private String title;
  private String question;
  private String answer;
  private Instant creDate;
  private Instant modDate;
}