package com.baeksutalchul.hiddendoor.utils.scheduling;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.baeksutalchul.hiddendoor.reservation.service.ReservationService;
import com.baeksutalchul.hiddendoor.timeSlot.service.TimeSlotService;

import jakarta.transaction.Transactional;

@Component
public class DataCleanUpScheduler {

  private final TimeSlotService timeSlotService;
  private final ReservationService reservationService;
  private final Logger logger = LoggerFactory.getLogger(DataCleanUpScheduler.class);

  public DataCleanUpScheduler(TimeSlotService timeSlotService, ReservationService reservationService) {
    this.timeSlotService = timeSlotService;
    this.reservationService = reservationService;
  }

  @Transactional
  @Scheduled(cron = "0 0 0 * * ?") // 매일 0시에 실행
  public void removeOldData() {
    try {
      // 서비스 시작일(예시) ~ 3년 + 1일 전까지 모두 삭제
      LocalDate startDate = LocalDate.parse("2022-06-28"); // 서비스 시작일 등 기준
      LocalDate targetDate = LocalDate.now().minusYears(3).minusDays(1); // 오늘로부터 3년+1일 전

      if (targetDate.isBefore(startDate)) {
          logger.info("삭제할 데이터가 없습니다. (targetDate < startDate)");
          return;
      }

      List<String> dateList = new ArrayList<>();
      LocalDate temp = startDate;
      while (!temp.isAfter(targetDate)) {
          dateList.add(temp.toString());
          temp = temp.plusDays(1);
      }

      List<String> reservationNumbers = timeSlotService.removeTimeSlots(dateList);

      if (!reservationNumbers.isEmpty()) {
          reservationService.removeReservation(reservationNumbers);
      }

      logger.info("데이터 정리 완료: {} ~ {}까지 삭제", startDate, targetDate);

    } catch (Exception e) {
      logger.info("error: {}", e);
    }
  }
  
}
