package com.baeksutalchul.hiddendoor.monitoring.service;

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.IntStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.dto.DailyThemeReservationDto;
import com.baeksutalchul.hiddendoor.dto.DashboardDto;
import com.baeksutalchul.hiddendoor.dto.ThemeReservationDto;
import com.baeksutalchul.hiddendoor.dto.ThemeTotalReservationDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.theme.repository.ThemeRepository;
import com.baeksutalchul.hiddendoor.timeSlot.repository.TimeSlotRepository;
import com.baeksutalchul.hiddendoor.timeSlot.domain.TimeSlot;
import com.baeksutalchul.hiddendoor.theme.domain.Theme;

import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.DateTimeException;
import java.time.LocalDate;

import java.time.ZoneId;

@Service
public class MonitoringService {

  private final ThemeRepository themeRepository;
  private final TimeSlotRepository timeSlotRepository;

  private static final ZoneId SEOUL_ZONE = ZoneId.of("Asia/Seoul");
  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_DATE;
  private static final TextStyle DAY_OF_WEEK_STYLE = TextStyle.FULL;
  private static final Locale LOCALE_KOREAN = Locale.KOREAN;

  private final Logger logger = LoggerFactory.getLogger(MonitoringService.class);

  public MonitoringService(ThemeRepository themeRepository, TimeSlotRepository timeSlotRepository) {
    this.themeRepository = themeRepository;

    this.timeSlotRepository = timeSlotRepository;
  }

  public ResponseDto<DashboardDto> getDashboardData() {

    try {
      DashboardDto dashboardDto = DashboardDto.builder()
          .themeDayReservations(getDayThemeReservationList())
          .themeTotalReservations(getThemeTotalReservationList())
          .dailyThemeReservations(getDailyReservationList())
          .build();

      return new ResponseDto<>(dashboardDto, "success");
    } catch (DataAccessException e) {
      throw new CustomException(ErrorCode.DATABASE_ERROR);
    } catch (DateTimeException e) {
      throw new CustomException(ErrorCode.INVALID_DATE_VALUE);
    } catch (Exception e) { // 예상치 못한 예외 처리
      logger.error("예상치 못한 오류 발생: {}", e.getMessage(), e);
      throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  // 1일 테마별 예약 현황
  private List<ThemeReservationDto> getDayThemeReservationList() {

    String today = LocalDate.now(SEOUL_ZONE).format(DATE_FORMATTER);
    // String today = "2025-04-11"; // 테스트용 하드코딩

    List<Theme> themeList = themeRepository.findAll();

    if (themeList.isEmpty()) {
      return Collections.emptyList();
    }

    return themeList.stream()
        .map(theme -> {
          String themeId = theme.getThemeId();

          List<TimeSlot> themeSlots = timeSlotRepository.findByDateAndThemeId(today,
              themeId);

          int totalSlots = themeSlots.stream()
              .mapToInt(timeSlot -> timeSlot.getSlots().size())
              .sum();

          int bookedSlots = themeSlots.stream()
              .filter(Objects::nonNull)
              .flatMap(timeSlot -> timeSlot.getSlots().stream())
              .filter(TimeSlot.TimeSlotDetail::isBooked)
              .mapToInt(slot -> 1)
              .sum();

          return new ThemeReservationDto(today, theme.getThemeName(), bookedSlots,
              totalSlots);
        })
        .toList();
  }

  // 1일 테마별 예약 현황
  private List<ThemeReservationDto> getDayThemeReservationList(String date) {

    List<Theme> themeList = themeRepository.findAll();

    if (themeList.isEmpty()) {
      return Collections.emptyList();
    }

    return themeList.stream()
        .map(theme -> {
          String themeId = theme.getThemeId();

          List<TimeSlot> themeSlots = timeSlotRepository.findByDateAndThemeId(date,
              themeId);

          int totalSlots = themeSlots.stream()
              .mapToInt(timeSlot -> timeSlot.getSlots().size())
              .sum();

          int bookedSlots = themeSlots.stream()
              .filter(Objects::nonNull)
              .flatMap(timeSlot -> timeSlot.getSlots().stream())
              .filter(TimeSlot.TimeSlotDetail::isBooked)
              .mapToInt(slot -> 1)
              .sum();

          return new ThemeReservationDto(date, theme.getThemeName(), bookedSlots,
              totalSlots);
        })
        .toList();
  }

  // 테마별 총 예약
  private List<ThemeTotalReservationDto> getThemeTotalReservationList() {

    List<Theme> themeList = themeRepository.findAll();

    if (themeList.isEmpty()) {
      return Collections.emptyList();
    }

    return themeList.stream().map(theme -> {
      String themeId = theme.getThemeId();
      long totalReservations = timeSlotRepository.findByThemeId(themeId).stream()
          .filter(Objects::nonNull)
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
  private List<DailyThemeReservationDto> getDailyReservationList() {
    LocalDate today = LocalDate.now(SEOUL_ZONE);

    return IntStream.range(0, 7)
        .mapToObj(today::plusDays)
        .map(this::getDailyThemeReservationDto)
        .toList();
  }

  private DailyThemeReservationDto getDailyThemeReservationDto(LocalDate localDate) {
    String dayOfWeek = localDate.getDayOfWeek()
        .getDisplayName(DAY_OF_WEEK_STYLE, LOCALE_KOREAN);

    String dateStr = localDate.format(DATE_FORMATTER);
    List<ThemeReservationDto> reservations = getDayThemeReservationList(dateStr);

    return new DailyThemeReservationDto(
        localDate,
        dayOfWeek,
        reservations);
  }

}
