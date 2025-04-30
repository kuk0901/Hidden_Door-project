package com.baeksutalchul.hiddendoor.reservation.service;

import com.baeksutalchul.hiddendoor.dto.ReservationDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.domain.Reservation;
import com.baeksutalchul.hiddendoor.reservation.repository.ReservationRepository;
import com.baeksutalchul.hiddendoor.theme.repository.ThemeRepository;
import com.baeksutalchul.hiddendoor.timeSlot.domain.TimeSlot;
import com.baeksutalchul.hiddendoor.timeSlot.repository.TimeSlotRepository;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;
import com.baeksutalchul.hiddendoor.utils.random.RandomString;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.IntStream;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ModelMapper modelMapper;
    private final ThemeRepository themeRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final Logger logger = LoggerFactory.getLogger(ReservationService.class);
    private final Instant defaultInstant = Instant.parse("1970-01-01T00:00:00Z");

    public ReservationService(
            ReservationRepository reservationRepository,
            ModelMapper modelMapper,
            ThemeRepository themeRepository,
            TimeSlotRepository timeSlotRepository) {
        this.reservationRepository = reservationRepository;
        this.modelMapper = modelMapper;
        this.themeRepository = themeRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    public ResponseDto<List<ReservationDto>> getReservationAll() {
        List<Reservation> reservationList = reservationRepository.findAll();

        List<ReservationDto> reservationDtoList = reservationList.stream()
            .map(reservation -> {
                ReservationDto reservationDto = modelMapper.map(reservation, ReservationDto.class);
                reservationDto
                        .setKstResDate(DateTimeUtil.convertToKoreanDateTime(reservation.getReservationDate()));
                reservationDto
                        .setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
                reservationDto.setKstPayDate(DateTimeUtil.convertToKoreanDate(reservation.getPaymentDate()));
                return reservationDto;
            })
            .toList();

        return new ResponseDto<>(reservationDtoList, "예약 데이터 반환");
    }

    public ResponseDto<ReservationDto> getReservationById(String reservationId) {
        Optional<Reservation> reservationOptional = reservationRepository.findById(reservationId);

        if (reservationOptional.isEmpty()) {
            return new ResponseDto<>(null, "예약 정보를 찾을 수 없습니다.");
        }

        Reservation reservation = reservationOptional.get();
        ReservationDto reservationDto = modelMapper.map(reservation, ReservationDto.class);
        reservationDto.setKstResDate(DateTimeUtil.convertToKoreanDateTime(reservation.getReservationDate()));
        reservationDto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
        reservationDto.setKstPayDate(DateTimeUtil.convertToKoreanDate(reservation.getPaymentDate()));

        return new ResponseDto<>(reservationDto, "예약 상세 정보 반환");
    }

    public ResponseDto<Map<String, Object>> getReservationMainPage() {
        Map<String, Object> pageData = new HashMap<>();
        pageData.put("availableDates", getAvailableDates(15));
        pageData.put("themes", themeRepository.findAll());
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

    public ResponseDto<Map<String, Object>> getAvailableTimeSlots(String date, String themeId) {
        TimeSlot timeSlot = timeSlotRepository.findByThemeIdAndDate(themeId, date)
            .orElseThrow(() -> new CustomException(ErrorCode.TIME_SLOT_NOT_FOUND));
    
        List<Map<String, Object>> availableTimeSlots = timeSlot.getSlots().stream()
            .map(slot -> {
                Map<String, Object> slotInfo = new HashMap<>();
                slotInfo.put("time", slot.getTime());
                slotInfo.put("isAvailable", !slot.isBooked());
                return slotInfo;
            })
            .toList();
    
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("timeSlots", availableTimeSlots);
        return new ResponseDto<>(responseData, "예약 가능 시간 조회 성공");
    }
    
    @Transactional
    public ResponseDto<ReservationDto> createReservation(ReservationDto dto) {
        String themeId = dto.getThemeId();
        String reservationDate = dto.getReservationDate().substring(0, 10);

        try {
            LocalDate.parse(reservationDate);
        } catch (DateTimeParseException e) {
            throw new CustomException(ErrorCode.INVALID_DATE_FORMAT, "잘못된 날짜 형식입니다.");
        }

        String reservationTime = dto.getReservationTime();
        TimeSlot timeSlot = timeSlotRepository.findByThemeIdAndDate(themeId, reservationDate)
                .orElseThrow(() -> new CustomException(ErrorCode.TIME_SLOT_NOT_FOUND));

        TimeSlot.TimeSlotDetail selectedSlot = timeSlot.getSlots().stream()
                .filter(slot -> slot.getTime().equals(reservationTime) && !slot.isBooked())
                .findFirst()
                .orElseThrow(() -> new CustomException(ErrorCode.ALREADY_RESERVED));

        // 예약 처리
        selectedSlot.setBooked(true);
        String reservationNumber = RandomString.getRandomShortString();
        selectedSlot.setReservationNumber(reservationNumber);
        timeSlotRepository.save(timeSlot);

        // 예약 정보 저장
        Reservation reservation = new Reservation();
        reservation.setThemeId(dto.getThemeId());
        reservation.setName(dto.getName());
        reservation.setPhone(dto.getPhone());
        reservation.setEmail(dto.getEmail());
        reservation.setReservationDate(combineDateTime(dto.getReservationDate(), dto.getReservationTime()));
        reservation.setPartySize(dto.getPartySize());
        reservation.setPaymentAmount(dto.getPaymentAmount());
        reservation.setAvailability(dto.getAvailability());
        reservation.setPaymentState(dto.getPaymentState());
        reservation.setPaymentMethod(dto.getPaymentMethod());
        reservation.setRefundState(dto.getRefundState());
        reservation.setReservationCreDate(Instant.now());
        reservation.setPaymentDate(defaultInstant);
        reservation.setReservationNumber(reservationNumber);

        Reservation saved = reservationRepository.save(reservation);
        ReservationDto responseDto = modelMapper.map(saved, ReservationDto.class);
        return new ResponseDto<>(responseDto, "예약이 성공적으로 생성되었습니다.");
    }

    private Instant combineDateTime(String dateStr, String timeStr) {
        try {
            LocalDate date = LocalDate.parse(dateStr.split("T")[0]);
            LocalTime time = LocalTime.parse(timeStr, DateTimeFormatter.ofPattern("HH:mm"));
            LocalDateTime dateTime = LocalDateTime.of(date, time);
            return dateTime.toInstant(ZoneOffset.UTC);
        } catch (DateTimeParseException e) {
            throw new CustomException(ErrorCode.INVALID_DATE_FORMAT, "잘못된 날짜 또는 시간 형식입니다.");
        }
    }

    public ResponseDto<ReservationDto> getReservationSummary(String reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new CustomException(ErrorCode.RESERVATION_NOT_FOUND, "예약을 찾을 수 없습니다."));
    
        ReservationDto dto = modelMapper.map(reservation, ReservationDto.class);
        dto.setKstResTime(DateTimeUtil.convertToKoreanTime(reservation.getReservationDate())); // 명시적 추가
        
        // 날짜/시간 변환 강화
        dto.setKstResDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationDate()));
        dto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
        
        return new ResponseDto<>(dto, "예약 요약 정보 조회 성공");
    }

    public boolean checkReservation(String reservationNumber, String name) {
        return reservationRepository.existsByReservationNumberAndName(reservationNumber, name);
    }
}
