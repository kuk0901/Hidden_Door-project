package com.baeksutalchul.hiddendoor.customer.domain;

import java.time.Instant;
import java.util.Date;

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
@Document(collection = "customer")
public class Customer {
  @Id
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
}