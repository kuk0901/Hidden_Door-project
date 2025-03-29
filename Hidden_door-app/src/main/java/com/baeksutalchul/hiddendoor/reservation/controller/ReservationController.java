package com.baeksutalchul.hiddendoor.reservation.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.dto.ReservationDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.service.ReservationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {
  private final ReservationService reservationService;
  private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

  public ReservationController(ReservationService reservationService) {
    this.reservationService = reservationService;
  }

  @GetMapping("/list")
  public ResponseEntity<ResponseDto<List<ReservationDto>>> getReservationAll() {
    return ResponseEntity.ok().body(reservationService.getReservationAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ResponseDto<ReservationDto>> getReservationById(
      @PathVariable("id") String reservationId) {
    return ResponseEntity.ok().body(reservationService.getReservationById(reservationId));
  }
  
  @GetMapping("/main")
  public ResponseEntity<ResponseDto<Map<String, Object>>> getReservationMainPage() {
    return ResponseEntity.ok(reservationService.getReservationMainPage());
  }

  @GetMapping("/availability")
  public ResponseEntity<ResponseDto<Map<String, Object>>> getAvailability(
    @RequestParam String date,
    @RequestParam String themeId) {
    return ResponseEntity.ok(reservationService.checkAvailability(date, themeId));
  }

  @PostMapping("/create")
  public ResponseEntity<ResponseDto<ReservationDto>> createReservation(@RequestBody ReservationDto reservationDto) {
    return ResponseEntity.ok(reservationService.createReservation(reservationDto));
  }

  @GetMapping("/summary/{reservationNumber}")
  public ResponseDto<ReservationDto> getReservationSummary(@PathVariable("reservationNumber") String reservationNumber) {
    return reservationService.getReservationSummary(reservationNumber);
  }

  @GetMapping("/check")
  public ResponseDto<Boolean> checkReservation(
    @RequestParam String reservationNumber,  // 개별 파라미터로 분리
    @RequestParam String name
  ) {
    boolean exists = reservationService.checkReservation(reservationNumber, name);
    return new ResponseDto<>(exists, exists ? "예약 확인 성공" : "예약 없음");
  }

  
}
