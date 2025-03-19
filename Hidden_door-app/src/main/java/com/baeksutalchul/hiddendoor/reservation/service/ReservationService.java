package com.baeksutalchul.hiddendoor.reservation.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.baeksutalchul.hiddendoor.dto.ReservationDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.domain.Reservation;
import com.baeksutalchul.hiddendoor.reservation.repository.ReservationRepository;
import com.baeksutalchul.hiddendoor.theme.domain.Theme;
import com.baeksutalchul.hiddendoor.theme.repository.ThemeRepository;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;

@Service
public class ReservationService {
  private ReservationRepository reservationRepository;
  private MongoTemplate mongoTemplate;
  private final ModelMapper modelMapper;
  private final ThemeRepository themeRepository;
  private final ObjectMapper objectMapper;
  private final Logger logger = LoggerFactory.getLogger(ReservationService.class);
  private final Instant defaultInstant = Instant.parse("1970-01-01T00:00:00Z");

  public ReservationService(ReservationRepository reservationRepository, ModelMapper modelMapper,
      MongoTemplate mongoTemplate, ThemeRepository themeRepository, ObjectMapper objectMapper) {
    this.reservationRepository = reservationRepository;
    this.modelMapper = modelMapper;
    this.mongoTemplate = mongoTemplate;
    this.themeRepository = themeRepository;
    this.objectMapper = objectMapper;
  }

  public ResponseDto<List<ReservationDto>> getReservationAll() {
    List<Reservation> reservationList = reservationRepository.findAll();

    List<ReservationDto> reservationDtoList = reservationList.stream()
        .map(reservation -> {
          ReservationDto reservationDto = new ReservationDto();

          reservationDto.setReservationId(reservation.getReservationId());
          reservationDto.setThemeId(reservation.getThemeId());
          reservationDto.setName(reservation.getName());
          reservationDto.setPhone(reservation.getPhone());
          reservationDto.setEmail(reservation.getEmail());
          reservationDto.setAvailability(reservation.getAvailability());
          reservationDto.setPaymentAmount(reservation.getPaymentAmount());
          reservationDto.setPaymentMethod(reservation.getPaymentMethod());
          reservationDto.setPaymentState(reservation.getPaymentState());
          reservationDto.setRefundState(reservation.getRefundState());
          reservationDto.setKstResDate(DateTimeUtil.convertToKoreanDateTime(reservation.getReservationDate()));
          reservationDto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
          logger.info("getPaymentDate: {}", reservation.getPaymentDate());
          reservationDto.setKstPayDate(DateTimeUtil.convertToKoreanDate(reservation.getPaymentDate()));
          logger.info("kstPayDate: {}", reservationDto.getKstPayDate());

          return reservationDto;
        })
        .toList();

    return new ResponseDto<>(reservationDtoList, "예약 데이터 반환");
  }

  public ResponseDto<ReservationDto> getReservationById(String reservationId) {
    Optional<Reservation> reservationOptional = reservationRepository.findById(reservationId);

    if (reservationOptional.isPresent()) {
      Reservation reservation = reservationOptional.get();
      ReservationDto reservationDto = modelMapper.map(reservation, ReservationDto.class);

      reservationDto.setKstResDate(DateTimeUtil.convertToKoreanDateTime(reservation.getReservationDate()));
      reservationDto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
      reservationDto.setKstPayDate(DateTimeUtil.convertToKoreanDate(reservation.getPaymentDate()));

      return new ResponseDto<>(reservationDto, "예약 상세 정보 반환");
    } else {
      return new ResponseDto<>(null, "예약 정보를 찾을 수 없습니다.");
    }

  }

  public ResponseDto<Map<String, Object>> getReservationMainPage() {
    Map<String, Object> pageData = new HashMap<>();

    List<String> availableDates = getAvailableDates(15);
    pageData.put("availableDates", availableDates);

    List<String> timeSlots = getTimeSlots();
    pageData.put("timeSlots", timeSlots);

    List<Theme> themes = themeRepository.findAll();
    pageData.put("themes", themes);

    return new ResponseDto<>(pageData, "예약 메인 페이지 데이터를 성공적으로 로드했습니다.");
  }

  private List<String> getAvailableDates(int days) {
    LocalDate startDate = LocalDate.now();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    return IntStream.range(0, days)
        .mapToObj(startDate::plusDays)
        .map(date -> date.format(formatter))
        .toList();
  }

  private List<String> getTimeSlots() {
    return List.of(
        "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00", "21:30");
  }

  public ResponseDto<Map<String, Object>> checkAvailability(String date, String themeId) {
    Map<String, Object> availabilityData = new HashMap<>();

    List<Reservation> existingReservations = reservationRepository.findByReservationDateAndThemeId(date, themeId);

    List<String> allTimeSlots = getTimeSlots();

    List<Map<String, Object>> availableTimeSlots = allTimeSlots.stream()
    .map(time -> {
        Map<String, Object> slot = new HashMap<>();
        slot.put("time", time);
        slot.put("isAvailable", !existingReservations.stream()
            .anyMatch(reservation -> 
                DateTimeUtil.convertToKSTDateTime(reservation.getReservationDate()).endsWith(time)));
        return slot;
    })
    .collect(Collectors.toList());

    availabilityData.put("date", date);
    availabilityData.put("themeId", themeId);
    availabilityData.put("timeSlots", availableTimeSlots);

    return new ResponseDto<>(availabilityData, "가용성 데이터를 성공적으로 로드했습니다.");
  }

  @Transactional
  public ResponseDto<Reservation> createReservation(ReservationDto dto) {
    Reservation reservation = new Reservation();
    reservation.setThemeId(dto.getThemeId());
    reservation.setName(dto.getName());
    reservation.setPhone(dto.getPhone());
    reservation.setEmail(dto.getEmail());
    
    // reservationDate와 reservationTime 처리
    Instant combinedDateTime = combineDateTime(dto.getReservationDate(), dto.getReservationTime());
    reservation.setReservationDate(combinedDateTime);
    
    reservation.setPartySize(dto.getPartySize());
    reservation.setPaymentAmount(dto.getPaymentAmount());
    reservation.setAvailability(dto.getAvailability());
    reservation.setPaymentState(dto.getPaymentState());
    reservation.setPaymentMethod(dto.getPaymentMethod());
    reservation.setRefundState(dto.getRefundState());

    // 서버에서 관리하는 값 설정
    reservation.setReservationCreDate(Instant.now());
    reservation.setPaymentDate(defaultInstant);

    Reservation saved = mongoTemplate.save(reservation);

    return new ResponseDto<>(saved, "예약이 성공적으로 생성되었습니다.");
  }

  // 날짜와 시간을 결합하는 헬퍼 메서드
  private Instant combineDateTime(String dateStr, String timeStr) {
    LocalDate date = LocalDate.parse(dateStr);
    LocalTime time = LocalTime.parse(timeStr);
    LocalDateTime dateTime = LocalDateTime.of(date, time);
    return dateTime.atZone(ZoneId.systemDefault()).toInstant();
  }
}