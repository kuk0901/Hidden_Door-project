package com.baeksutalchul.hiddendoor.reservation.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.dto.ReservationDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.domain.Reservation;
import com.baeksutalchul.hiddendoor.reservation.repository.ReservationRepository;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;

@Service
public class ReservationService {
  private ReservationRepository reservationRepository;
  private MongoTemplate mongoTemplate;
  private final ModelMapper modelMapper;
  private final Logger logger = LoggerFactory.getLogger(ReservationService.class);
  private final Instant defaulInstant = Instant.parse("1970-01-01T00:00:00Z");

  public ReservationService(ReservationRepository reservationRepository, ModelMapper modelMapper, MongoTemplate mongoTemplate) {
    this.reservationRepository = reservationRepository;
    this.modelMapper = modelMapper;
    this.mongoTemplate = mongoTemplate;
  }

  // admin
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

  // admin
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
  
}
