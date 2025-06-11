package com.baeksutalchul.hiddendoor.reservation.controller;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.dto.ReservationDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.mail.dto.MailDto;
import com.baeksutalchul.hiddendoor.mail.service.MailService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.service.ReservationService;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {
  private final ReservationService reservationService;
  private final MailService mailService;
  private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

  public ReservationController(ReservationService reservationService, MailService mailService) {
    this.reservationService = reservationService;
    this.mailService = mailService;
  }

  @GetMapping("/list")
  public ResponseEntity<ResponseDto<List<ReservationDto>>> getReservationAll(
    @RequestParam(name= "page", required = false, defaultValue = "1") int page,
    @RequestParam(name= "size", required = false, defaultValue = "10") int size,
    @RequestParam(name= "sortField", required = false, defaultValue = "reservationCreDate") String sortField,
    @RequestParam(name= "sortDirection", required = false, defaultValue = "ASC") String sortDirection,
    @RequestParam(name= "searchField", required = false) String searchField,
    @RequestParam(name= "searchTerm", required = false) String searchTerm
  ) {
    PageDto pageDto = new PageDto(
      page, 
      size, 
      0L, 
      0, 
      page == 1, 
      false, 
      sortField, 
      sortDirection);
    return ResponseEntity.ok().body(reservationService.getReservationAll(pageDto, searchField, searchTerm));
  }


  @GetMapping("/{id}")
  public ResponseEntity<ResponseDto<ReservationDto>> getReservationById(
      @PathVariable("id") String reservationId) {
    return ResponseEntity.ok().body(reservationService.getReservationById(reservationId));
  }
  
  @PatchMapping("/{id}/payment")
  public ResponseEntity<ResponseDto<ReservationDto>> updatePaymentState(
      @PathVariable("id") String reservationId,
      @RequestBody Map<String, String> request) {
    String paymentState = request.get("paymentState");
    return ResponseEntity.ok().body(reservationService.updatePaymentState(reservationId, paymentState));
  }


  @GetMapping("/main")
  public ResponseEntity<ResponseDto<Map<String, Object>>> getReservationMainPage() {
    return ResponseEntity.ok(reservationService.getReservationMainPage());
  }

  @GetMapping("/timeslots")
  public ResponseDto<?> getAvailableTimeSlots(
    @RequestParam("date") String date,
    @RequestParam("themeId") String themeId
  ) {
    logger.info("조회 요청 - themeId: {}, date: {}", themeId, date);

    return reservationService.getAvailableTimeSlots(date, themeId);
  }

  @PostMapping("/create")
  public ResponseEntity<ResponseDto<ReservationDto>> createReservation(@RequestBody ReservationDto reservationDto) {

    ResponseDto<ReservationDto> res = reservationService.createReservation(reservationDto);

    try {
        LocalDate date = LocalDate.parse(reservationDto.getReservationDateStr());
        String formattedDate = date.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일"));

        String message = String.format("""
            안녕하세요, %s님!

            예약이 성공적으로 완료되었습니다.

            예약 번호: %s
            예약 날짜: %s
            예약 시간: %s

            감사합니다.""",
            reservationDto.getName(),
            res.getData().getReservationNumber(),
            formattedDate,
            reservationDto.getReservationTime()
        );

        // 3파라미터 생성자 사용!
        MailDto mailDto = new MailDto(
            reservationDto.getEmail(),
            "Hidden_door 방탈출 카페 예약 완료 안내",
            message
        );

        mailService.sendMail(mailDto);

    } catch (Exception e) {
        e.printStackTrace(); // 실제 에러 원인을 콘솔에 출력
        throw new CustomException(ErrorCode.MAIL_SEND_FAILED);
    }

    return ResponseEntity.ok(res);
  }


  @GetMapping("/summary/{reservationNumber}")
  public ResponseDto<ReservationDto> getReservationSummary(
      @PathVariable("reservationNumber") String reservationNumber) {
    return reservationService.getReservationSummary(reservationNumber);
  }

  @GetMapping("/check")
  public ResponseDto<Boolean> checkReservation(
      @RequestParam("reservationNumber") String reservationNumber, // 개별 파라미터로 분리
      @RequestParam("name") String name) {
    boolean exists = reservationService.checkReservation(reservationNumber, name);
    return new ResponseDto<>(exists, exists ? "예약 확인 성공" : "예약 없음");
  }

}
