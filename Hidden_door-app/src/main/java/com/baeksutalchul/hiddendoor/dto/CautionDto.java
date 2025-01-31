package com.baeksutalchul.hiddendoor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CautionDto {
  private String cautionId;
  private String icon;
  private String title;
  private String content;
}
