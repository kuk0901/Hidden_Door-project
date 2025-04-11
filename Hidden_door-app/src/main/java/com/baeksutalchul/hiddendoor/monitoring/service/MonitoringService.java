package com.baeksutalchul.hiddendoor.monitoring.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.IntStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.baeksutalchul.hiddendoor.admin.controller.AdminController;
import com.baeksutalchul.hiddendoor.dto.DailyThemeReservationDto;
import com.baeksutalchul.hiddendoor.dto.DashboardDto;
import com.baeksutalchul.hiddendoor.dto.ThemeReservationDto;
import com.baeksutalchul.hiddendoor.dto.ThemeTotalReservationDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.repository.ReservationRepository;
import com.baeksutalchul.hiddendoor.theme.repository.ThemeRepository;
import com.baeksutalchul.hiddendoor.timeSlot.repository.TimeSlotRepository;
import com.baeksutalchul.hiddendoor.timeSlot.domain.TimeSlot;
import com.baeksutalchul.hiddendoor.theme.domain.Theme;

import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
public class MonitoringService {

  private final ThemeRepository themeRepository;
  private final TimeSlotRepository timeSlotRepository;

  private final Logger logger = LoggerFactory.getLogger(MonitoringService.class);

  public MonitoringService(ThemeRepository themeRepository, TimeSlotRepository timeSlotRepository) {
    this.themeRepository = themeRepository;

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

  // 1일 테마별 예약 현황
  private List<ThemeReservationDto> getDayThemeReservationList() {
    String today = LocalDate.now(ZoneId.of("Asia/Seoul")).format(DateTimeFormatter.ISO_DATE);
    // String today = "2025-04-11"; // 테스트용 하드코딩

    return themeRepository.findAll()
        .stream()
        .map(theme -> {
          String themeId = theme.getThemeId();

          List<TimeSlot> themeSlots = timeSlotRepository.findByDateAndThemeId(today, themeId);

          int totalSlots = themeSlots.stream()
              .mapToInt(timeSlot -> timeSlot.getSlots().size())
              .sum();

          int bookedSlots = themeSlots.stream()
              .flatMap(timeSlot -> timeSlot.getSlots().stream())
              .filter(TimeSlot.TimeSlotDetail::isBooked)
              .mapToInt(slot -> 1)
              .sum();

          return new ThemeReservationDto(today, theme.getThemeName(), bookedSlots, totalSlots);
        })
        .toList();
  }

  // 1일 테마별 예약 현황
  private List<ThemeReservationDto> getDayThemeReservationList(String date) {

    return themeRepository.findAll()
        .stream()
        .map(theme -> {
          String themeId = theme.getThemeId();

          List<TimeSlot> themeSlots = timeSlotRepository.findByDateAndThemeId(date, themeId);

          int totalSlots = themeSlots.stream()
              .mapToInt(timeSlot -> timeSlot.getSlots().size())
              .sum();

          int bookedSlots = themeSlots.stream()
              .flatMap(timeSlot -> timeSlot.getSlots().stream())
              .filter(TimeSlot.TimeSlotDetail::isBooked)
              .mapToInt(slot -> 1)
              .sum();

          return new ThemeReservationDto(date, theme.getThemeName(), bookedSlots, totalSlots);
        })
        .toList();
  }

  // 테마별 총 예약
  private List<ThemeTotalReservationDto> getThemeTotalReservationList() {
    List<Theme> themes = themeRepository.findAll();

    return themes.stream().map(theme -> {
      String themeId = theme.getThemeId();
      long totalReservations = timeSlotRepository.findByThemeId(themeId).stream()
          .flatMap(timeSlot -> timeSlot.getSlots().stream())
          .filter(TimeSlot.TimeSlotDetail::isBooked)
          .count();

      return new ThemeTotalReservationDto(
          themeId,
          theme.getThemeName(),
          (int) totalReservations);
    }).toList();
  }

  // 일주일별 테마 예약
  private List<DailyThemeReservationDto> getDayReservationList() {
    LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul"));

    return IntStream.range(0, 7)
        .mapToObj(today::plusDays)
        .map(this::getDailyThemeReservationDto)
        .toList();
  }

  private DailyThemeReservationDto getDailyThemeReservationDto(LocalDate localDate) {
    String dayOfWeek = localDate.getDayOfWeek()
        .getDisplayName(TextStyle.FULL, Locale.KOREAN);

    String dateStr = localDate.format(DateTimeFormatter.ISO_DATE);
    List<ThemeReservationDto> reservations = getDayThemeReservationList(dateStr);

    return new DailyThemeReservationDto(
        localDate,
        dayOfWeek,
        reservations);
  }

}
