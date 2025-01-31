package com.baeksutalchul.hiddendoor.faq.domain;

import java.util.Date;

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
  private Date creDate;
  private Date modDate; 
}