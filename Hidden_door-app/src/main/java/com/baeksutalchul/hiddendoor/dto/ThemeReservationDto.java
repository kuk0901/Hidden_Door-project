package com.baeksutalchul.hiddendoor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeReservationDto {
  private String date; // 2025-04-05
  private String themeName;
  private int reservations;
  private int total;
}
