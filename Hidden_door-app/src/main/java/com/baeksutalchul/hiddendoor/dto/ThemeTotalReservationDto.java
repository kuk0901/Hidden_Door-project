package com.baeksutalchul.hiddendoor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeTotalReservationDto {
  private String themeId;
  private String themeName;
  private int totalReservations;
}
