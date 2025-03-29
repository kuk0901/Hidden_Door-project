package com.baeksutalchul.mail.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MailDto {
  private String address;
  private String title = "Hidden_door 방탈출 카페 예약 완료 안내";
  private String message;

  public MailDto(String address, String message) {
    this.address = address;
    this.message = message;
  }
}
