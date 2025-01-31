package com.baeksutalchul.hiddendoor.reservation.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.dto.ReservationDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.domain.Reservation;
import com.baeksutalchul.hiddendoor.reservation.repository.ReservationRepository;

@Service
public class ReservationService {
  private ReservationRepository reservationRepository;
  private final ModelMapper modelMapper;
  private static final Logger logger = LoggerFactory.getLogger(ReservationService.class);

  public ReservationService(ReservationRepository reservationRepository, ModelMapper modelMapper) {
    this.reservationRepository = reservationRepository;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<List<ReservationDto>> getReservationAll() {
    List<Reservation> reservationList = reservationRepository.findAll();

    logger.info("reservationList: {}", reservationList);

    List<ReservationDto> reservationDtoList = reservationList.stream()
      .map(reservation -> modelMapper.map(reservation, ReservationDto.class))
      .toList();

    logger.info("reservationDtoList: {}", reservationDtoList);

    return new ResponseDto<>(reservationDtoList, "예약 데이터 반환");
  }
}
