package com.baeksutalchul.hiddendoor.reservation.service;

import com.baeksutalchul.hiddendoor.dto.ReservationDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.reservation.domain.Reservation;
import com.baeksutalchul.hiddendoor.reservation.repository.ReservationRepository;
import com.baeksutalchul.hiddendoor.theme.domain.Theme;
import com.baeksutalchul.hiddendoor.theme.repository.ThemeRepository;
import com.baeksutalchul.hiddendoor.timeSlot.domain.TimeSlot;
import com.baeksutalchul.hiddendoor.timeSlot.repository.TimeSlotRepository;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;
import com.baeksutalchul.hiddendoor.utils.page.PageableUtil;
import com.baeksutalchul.hiddendoor.utils.random.RandomString;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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

    public ResponseDto<List<ReservationDto>> getReservationAll(PageDto pageDto, String searchField, String searchTerm) {
        Pageable pageable = PageableUtil.createPageRequest(
                Math.max(0, pageDto.getPage() - 1),
                pageDto.getSize(),
                pageDto.getSortField(),
                pageDto.getSortDirection());

        List<Theme> allThemes = themeRepository.findAll();
        Map<String, String> themeIdNameMap = allThemes.stream()
                .collect(Collectors.toMap(Theme::getThemeId, Theme::getThemeName));

        Page<Reservation> reservationList;

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            switch (searchField) {
                case "name":
                    reservationList = reservationRepository.findByNameContainingOrderByReservationCreDateAsc(searchTerm,
                            pageable);
                    break;
                case "themeName":
                    List<String> themeIds = allThemes.stream()
                            .filter(theme -> theme.getThemeName().contains(searchTerm))
                            .map(Theme::getThemeId)
                            .toList();

                    if (themeIds.isEmpty()) {
                        Page<Reservation> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);
                        return new ResponseDto<>(
                                Collections.emptyList(),
                                "예약 데이터 없음",
                                PageableUtil.createPageDto(emptyPage),
                                searchField,
                                searchTerm);
                    }
                    reservationList = reservationRepository.findByThemeIdInOrderByReservationCreDateAsc(themeIds,
                            pageable);
                    break;
                default:
                    reservationList = reservationRepository.findAllByOrderByReservationCreDateAsc(pageable);
            }
        } else {
            reservationList = reservationRepository.findAllByOrderByReservationCreDateAsc(pageable);
        }

        // XXX: reservationList.getContent()가 비어있을 때 예외 처리가 아닌 비어있는 데이터 반환
        // 화면에서 비어있는 데이터 처리로 이어져야 함
        if (reservationList.isEmpty()) {
            PageDto resultPageDto = PageableUtil.createPageDto(reservationList);
            return new ResponseDto<>(
                Collections.emptyList(),
                "예약 데이터 없음",
                resultPageDto,
                searchField,
                searchTerm
            );
        }
        List<ReservationDto> reservationDtoList = reservationList.getContent().stream()
                .map(reservation -> {
                    ReservationDto dto = modelMapper.map(reservation, ReservationDto.class);
                    dto.setThemeName(themeIdNameMap.getOrDefault(reservation.getThemeId(), ""));
                    dto.setKstResDate(DateTimeUtil.convertToKoreanDateTimeNoSeconds(reservation.getReservationDate()));
                    dto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
                    dto.setKstPayDate(DateTimeUtil.convertToKoreanDate(reservation.getPaymentDate()));
                    return dto;
                })
                .toList();

        PageDto resultPageDto = PageableUtil.createPageDto(reservationList);
        return new ResponseDto<>(reservationDtoList, "예약 데이터 반환", resultPageDto, searchField, searchTerm);
    }

    public ResponseDto<ReservationDto> getReservationById(String reservationId) {
        Optional<Reservation> reservationOptional = reservationRepository.findById(reservationId);

        if (reservationOptional.isEmpty()) {
            return new ResponseDto<>(null, "예약 정보를 찾을 수 없습니다.");
        }

        Reservation reservation = reservationOptional.get();
        ReservationDto reservationDto = modelMapper.map(reservation, ReservationDto.class);

        reservationDto.setKstResDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationDate()));
        reservationDto.setKstResTime(DateTimeUtil.convertToKoreanTime(reservation.getReservationDate()));
        reservationDto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
        reservationDto.setKstPayDate(DateTimeUtil.convertToKoreanDate(reservation.getPaymentDate()));
        reservationDto.setPaymentMethod(reservation.getPaymentMethod());
        reservationDto.setPaymentState(reservation.getPaymentState());

        themeRepository.findById(reservation.getThemeId())
                .ifPresent(theme -> reservationDto.setThemeName(theme.getThemeName()));

        return new ResponseDto<>(reservationDto, "예약 상세 정보 반환");
    }

    public ResponseDto<ReservationDto> updatePaymentState(String reservationId, String paymentState) {
        Optional<Reservation> reservationOptional = reservationRepository.findById(reservationId);
        if (reservationOptional.isEmpty()) {
            return new ResponseDto<>(null, "예약 정보를 찾을 수 없습니다.");
        }

        Reservation reservation = reservationOptional.get();

        reservation.setPaymentState(paymentState);
        if ("Y".equals(paymentState)) {
            reservation.setPaymentDate(Instant.now());
        } else {
            reservation.setPaymentDate(Instant.ofEpochMilli(0));
        }
        
        reservationRepository.save(reservation);
    
        ReservationDto reservationDto = modelMapper.map(reservation, ReservationDto.class);
        reservationDto.setKstPayDate(DateTimeUtil.convertToKoreanDate(reservation.getPaymentDate()));

        reservationDto.setKstResDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationDate()));
        reservationDto.setKstResTime(DateTimeUtil.convertToKoreanTime(reservation.getReservationDate()));
        reservationDto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));
        reservationDto.setPaymentMethod(reservation.getPaymentMethod());
        reservationDto.setPaymentState(reservation.getPaymentState());
        themeRepository.findById(reservation.getThemeId())
            .ifPresent(theme -> reservationDto.setThemeName(theme.getThemeName()));

        return new ResponseDto<>(reservationDto, "결제 상태 갱신");
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
        String reservationDate = dto.getReservationDateStr().substring(0, 10);

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

        selectedSlot.setBooked(true);
        String reservationNumber = RandomString.getRandomShortString();
        selectedSlot.setReservationNumber(reservationNumber);
        timeSlotRepository.save(timeSlot);

        Reservation reservation = new Reservation();
        reservation.setThemeId(dto.getThemeId());
        reservation.setName(dto.getName());
        reservation.setPhone(dto.getPhone());
        reservation.setEmail(dto.getEmail());
        reservation.setReservationDate(combineDateTime(dto.getReservationDateStr(), dto.getReservationTime()));
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
            String onlyDate = dateStr.contains("T") ? dateStr.split("T")[0] : dateStr;
            LocalDate date = LocalDate.parse(onlyDate);
            LocalTime time = LocalTime.parse(timeStr, DateTimeFormatter.ofPattern("HH:mm"));
            LocalDateTime dateTime = LocalDateTime.of(date, time);
            ZoneId zoneId = ZoneId.of("Asia/Seoul");
            return dateTime.atZone(zoneId).toInstant();
        } catch (DateTimeParseException e) {
            logger.error(e.getMessage());
            throw new CustomException(ErrorCode.INVALID_DATE_FORMAT, "잘못된 날짜 또는 시간 형식입니다.");
        }
    }

    public ResponseDto<ReservationDto> getReservationSummary(String reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new CustomException(ErrorCode.RESERVATION_NOT_FOUND, "예약을 찾을 수 없습니다."));

        ReservationDto dto = modelMapper.map(reservation, ReservationDto.class);
        dto.setKstResTime(DateTimeUtil.convertToKoreanTime(reservation.getReservationDate()));

        dto.setKstResDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationDate()));
        dto.setKstResCreDate(DateTimeUtil.convertToKoreanDate(reservation.getReservationCreDate()));

        return new ResponseDto<>(dto, "예약 요약 정보 조회 성공");
    }

    public boolean checkReservation(String reservationNumber, String name) {
        return reservationRepository.existsByReservationNumberAndName(reservationNumber, name);
    }
}
