package com.baeksutalchul.hiddendoor.timeSlot.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.escapeRoom.domain.EscapeRoom;
import com.baeksutalchul.hiddendoor.escapeRoom.repository.EscapeRoomRepository;
import com.baeksutalchul.hiddendoor.theme.domain.Theme;
import com.baeksutalchul.hiddendoor.theme.repository.ThemeRepository;
import com.baeksutalchul.hiddendoor.timeSlot.domain.TimeSlot;
import com.baeksutalchul.hiddendoor.timeSlot.domain.TimeSlot.TimeSlotDetail;
import com.baeksutalchul.hiddendoor.timeSlot.repository.TimeSlotRepository;

@Service
public class TimeSlotService {
  private final TimeSlotRepository timeSlotRepository;
  private final ThemeRepository themeRepository;
  private final EscapeRoomRepository escapeRoomRepository;
  private final Logger logger = LoggerFactory.getLogger(TimeSlotService.class);

  public TimeSlotService(TimeSlotRepository timeSlotRepository, ThemeRepository themeRepository, EscapeRoomRepository escapeRoomRepository) {
    this.timeSlotRepository = timeSlotRepository;
    this.themeRepository = themeRepository;
    this.escapeRoomRepository = escapeRoomRepository;
  }

  // 서버 시작 시 실행 (ApplicationReadyEvent 리스너)
  @EventListener(ApplicationReadyEvent.class)
  public void onStartup() {
    generateSlotsForNext16Days(); // 서버 시작 시 16일치 슬롯 생성
  }

  // 매일 자정 실행 (기존 스케줄러 유지)
  @Scheduled(cron = "0 0 0 * * ?")
  public void onMidnight() {
    generateSlotsForNext16Days(); // 매일 자정 16일치 슬롯 갱신
  }

  // 공통 로직 분리
  private void generateSlotsForNext16Days() {
    LocalDate kstDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
    for (int i = 1; i <= 16; i++) { // 오늘부터 16일 후까지 처리
        LocalDate targetDate = kstDate.plusDays(i);
        generateSlotsForDate(targetDate);
    }
  }

  // 특정 날짜에 대한 슬롯 생성 (수정된 버전)
  private void generateSlotsForDate(LocalDate date) {
    List<Theme> themes = themeRepository.findAll();
    EscapeRoom escapeRoom = escapeRoomRepository.findAll().get(0);  // 기본적으로 1개의 EscapeRoom만 있다고 가정
      
    themes.forEach(theme -> {
      if (!theme.getAvailableDays().contains(date.getDayOfWeek().toString())) {
          return; // 운영일이 아니면 패스
      }

      // 이미 슬롯이 존재하는지 확인
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
      String formattedDate = date.format(formatter);
      String slotId = theme.getThemeId() + "_" + formattedDate;
      
      Optional<TimeSlot> existingSlot = timeSlotRepository.findById(slotId);

      if (existingSlot.isEmpty()) { // 존재하지 않을 때만 생성
        List<TimeSlotDetail> slots = new ArrayList<>();
        LocalTime openTime = LocalTime.parse(escapeRoom.getOpenTime());  // String → LocalTime 변환
        LocalTime closeTime = LocalTime.parse(escapeRoom.getCloseTime());

        while (openTime.plusMinutes(theme.getTime()).isBefore(closeTime)) {  // 플레이 종료 시간이 closeTime을 넘지 않도록
          slots.add(new TimeSlotDetail(
            openTime.format(DateTimeFormatter.ofPattern("HH:mm")),
            false,
            null
          ));
          openTime = openTime.plusMinutes(theme.getTime() + 30); // 플레이시간 + 청소시간
        }

        try {
          TimeSlot newSlot = new TimeSlot(slotId, theme.getThemeId(), date.format(DateTimeFormatter.ISO_DATE), slots);
          timeSlotRepository.save(newSlot);
          logger.info("새 타임슬롯 생성 완료: {}", slotId);
        } catch (Exception e) {
          logger.error("타임슬롯 저장 실패: {}", slotId, e);
        }
      }
    });
  }

  public List<String> removeTimeSlots(List<String> dateList) {
    List<TimeSlot> slotsToDelete = timeSlotRepository.findByDateIn(dateList);

    Set<String> reservationNumbers = new HashSet<>();
    for (TimeSlot timeSlot : slotsToDelete) {
        for (TimeSlot.TimeSlotDetail detail : timeSlot.getSlots()) {
            if (detail.getReservationNumber() != null && !detail.getReservationNumber().isEmpty()) {
                reservationNumbers.add(detail.getReservationNumber());
            }
        }
    }

    timeSlotRepository.deleteByDateIn(dateList);

    return new ArrayList<>(reservationNumbers);
  }
}
