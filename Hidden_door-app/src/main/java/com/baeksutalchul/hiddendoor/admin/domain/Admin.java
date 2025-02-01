package com.baeksutalchul.hiddendoor.admin.domain;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "admin")
public class Admin {
  @Id
  private String adminId;
  private String userName;
  private String phone;
  private String email;
  private String pwd;
  private String token;
  private List<String> roles;
}
