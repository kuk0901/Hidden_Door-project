package com.baeksutalchul.hiddendoor.reservation.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.dto.ReservationDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.domain.Reservation;
import com.baeksutalchul.hiddendoor.reservation.repository.ReservationRepository;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;

@Service
public class ReservationService {
  private ReservationRepository reservationRepository;
  private final ModelMapper modelMapper;
  private final Logger logger = LoggerFactory.getLogger(ReservationService.class);

  public ReservationService(ReservationRepository reservationRepository, ModelMapper modelMapper) {
    this.reservationRepository = reservationRepository;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<List<ReservationDto>> getReservationAll() {
    List<Reservation> reservationList = reservationRepository.findAll();

    logger.info("reservationList: {}", reservationList);

    List<ReservationDto> reservationDtoList = reservationList.stream()
        .map(reservation -> {
          ReservationDto reservationDto = modelMapper.map(reservation, ReservationDto.class);
          reservationDto.setKstResDate(DateTimeUtil.convertToKoreanDateTime(reservation.getReservationDate()));
          reservationDto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
          reservationDto.setKstPayDate(DateTimeUtil.convertToKoreanDateTime(reservation.getPaymentDate()));

          return reservationDto;
        })
        .toList();

    logger.info("reservationDtoList: {}", reservationDtoList);

    return new ResponseDto<>(reservationDtoList, "예약 데이터 반환");
  }

  public ResponseDto<ReservationDto> getReservationById(String reservationId) {
    Optional<Reservation> reservationOptional = reservationRepository.findById(reservationId);

    if (reservationOptional.isPresent()) {
      Reservation reservation = reservationOptional.get();
      ReservationDto reservationDto = modelMapper.map(reservation, ReservationDto.class);

      reservationDto.setKstResDate(DateTimeUtil.convertToKoreanDateTime(reservation.getReservationDate()));
      reservationDto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
      reservationDto.setKstPayDate(DateTimeUtil.convertToKoreanDateTime(reservation.getPaymentDate()));

      return new ResponseDto<>(reservationDto, "예약 상세 정보 반환");
    } else {
      return new ResponseDto<>(null, "예약 정보를 찾을 수 없습니다.");
    }

  }
}
