package com.baeksutalchul.hiddendoor.reservation.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.dto.ReservationDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.service.ReservationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
      @PathVariable("id")  String reservationId) {
    return ResponseEntity.ok().body(reservationService.getReservationById(reservationId));
  }

}
