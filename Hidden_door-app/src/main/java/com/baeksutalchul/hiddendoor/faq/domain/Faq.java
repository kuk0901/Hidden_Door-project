package com.baeksutalchul.hiddendoor.faq.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
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

  @CreatedDate
  private Instant creDate;

  @LastModifiedDate
  private Instant modDate;
}