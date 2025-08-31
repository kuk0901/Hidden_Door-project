package com.baeksutalchul.hiddendoor.utils.scheduling;

import java.time.LocalDate;
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
  @Scheduled(cron = "0 0 0 1 * ?")
  public void removeOldData() {
    try {
      LocalDate targetDate = LocalDate.now().minusYears(3).minusDays(1); // 오늘로부터 3년+1일 전

      List<String> reservationNumbers = timeSlotService.removeTimeSlotsBeforeOrEqual(targetDate);

      if (reservationNumbers != null && !reservationNumbers.isEmpty()) {
          reservationService.removeReservation(reservationNumbers);
      }

      logger.info("데이터 정리 완료: {}까지 삭제", targetDate);

    } catch (Exception e) {
        logger.info("error: {}", e.getMessage(), e);
    }
  }
  
}
