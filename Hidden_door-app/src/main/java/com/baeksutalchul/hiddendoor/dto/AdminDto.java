package com.baeksutalchul.hiddendoor.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDto {
  private String adminId;
  private String userName;
  private String phone;
  private String email;
  private String pwd;
  private String token;
  private List<String> roles;
  private int rolesCount;
}
