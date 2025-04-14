package com.baeksutalchul.hiddendoor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardDto {
  // 테마별 일일 예약 (Bar 차트용)
  private List<ThemeReservationDto> themeDayReservations;

  // 테마별 총 예약 (Pie 차트용)
  private List<ThemeTotalReservationDto> themeTotalReservations;

  // 일별 테마 예약
  private List<DailyThemeReservationDto> dailyThemeReservations;

}
