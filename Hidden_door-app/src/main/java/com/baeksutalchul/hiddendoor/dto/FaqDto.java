package com.baeksutalchul.hiddendoor.dto;

import java.time.Instant;

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
  private Instant creDate;
  private Instant modDate;
  private String kstCreDate;
  private String kstModDate;
}
