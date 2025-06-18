package com.baeksutalchul.hiddendoor.customer.domain;

import java.time.Instant;
import org.springframework.data.annotation.Id;
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
  private String customerTitle; 
  private String customerContent; 
  private String customerCheck; 
  private String customerAnswer; 
  private String adminName;
  private int customerPwd;
  private Instant queCreDate;
  private Instant ansCreDate; 
}