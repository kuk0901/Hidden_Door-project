package com.baeksutalchul.hiddendoor.monitoring.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.dto.DailyThemeReservationDto;
import com.baeksutalchul.hiddendoor.dto.DashboardDto;
import com.baeksutalchul.hiddendoor.dto.ThemeReservationDto;
import com.baeksutalchul.hiddendoor.dto.ThemeTotalReservationDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.repository.ReservationRepository;
import com.baeksutalchul.hiddendoor.theme.repository.ThemeRepository;
import com.baeksutalchul.hiddendoor.timeSlot.repository.TimeSlotRepository;

@Service
public class MonitoringService {

  private final ThemeRepository themeRepository;
  private final ReservationRepository reservationRepository;
  private final TimeSlotRepository timeSlotRepository;

  private final Logger logger = LoggerFactory.getLogger(MonitoringService.class);

  public MonitoringService(ThemeRepository themeRepository, ReservationRepository reservationRepository,
      TimeSlotRepository timeSlotRepository) {
    this.themeRepository = themeRepository;
    this.reservationRepository = reservationRepository;
    this.timeSlotRepository = timeSlotRepository;
  }

  // FIXME: exception 처리 고려
  public ResponseDto<DashboardDto> getDashboardData() {

    List<ThemeReservationDto> themeDayReservationDtoList = getDayThemeReservationList();

    List<ThemeTotalReservationDto> themeTotalReservationDtoList = getThemeTotalReservationList();

    List<DailyThemeReservationDto> dailyThemeReservationDtoList = getDayReservationList();

    DashboardDto dashboardDto = new DashboardDto(themeDayReservationDtoList, themeTotalReservationDtoList,
        dailyThemeReservationDtoList);

    return new ResponseDto<>(dashboardDto, "success");
  }

  // FIXME: 오늘의 예약수(1일) -> 테마별 예약 수량, 예약, 잔여량
  private List<ThemeReservationDto> getDayThemeReservationList() {

    // themeDayReservations -> ThemeDayReservationChart
    return null;
  }

  // FIXME: 테마별 총 예약 -> 테마별 예약
  private List<ThemeTotalReservationDto> getThemeTotalReservationList() {

    // themeTotalReservations -> ThemeTotalReservationChart
    return null;
  }

  // FIXME: 일별 테마 예약(임시) -> 7일 기준 -> 테마별 예약
  private List<DailyThemeReservationDto> getDayReservationList() {

    // dailyReservations -> DayReservationChart
    return null;
  }

}
