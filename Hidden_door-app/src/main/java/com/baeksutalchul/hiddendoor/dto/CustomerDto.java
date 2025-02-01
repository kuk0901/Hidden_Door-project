package com.baeksutalchul.hiddendoor.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {
  private String customerId;
  private String customerName;
  private String customerEmail;
  private String customerTitle;
  private String customerContent;
  private String customerCheck;
  private String customerAnswer;
  private String adminName;
  private int customerPwd;
  private Instant queCreDate;
  private Instant ansCreDate;
  private String kstQueCreDate;
  private String kstAnsCreDate;

}
