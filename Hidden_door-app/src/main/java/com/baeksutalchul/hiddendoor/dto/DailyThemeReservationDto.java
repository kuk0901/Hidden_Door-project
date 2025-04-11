package com.baeksutalchul.hiddendoor.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 주간
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyThemeReservationDto {
  private LocalDate localDate;
  private String date; // 월요일
  private List<ThemeReservationDto> themeReservations;

}
