package com.baeksutalchul.hiddendoor.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaqDto {
  private String faqId; 
  private String writer; 
  private String title;
  private String category; 
  private String question;
  private String answer;
  private Date creDate;
  private Date modDate; 
}
