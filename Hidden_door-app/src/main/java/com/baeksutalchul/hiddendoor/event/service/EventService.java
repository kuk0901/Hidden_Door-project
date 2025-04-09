package com.baeksutalchul.hiddendoor.event.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.event.domain.Event;
import com.baeksutalchul.hiddendoor.event.repository.EventRepository;
import com.baeksutalchul.hiddendoor.dto.EventDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<EventDto> getAllEvents() {
        try {
            List<Event> events = eventRepository.findAll();
            return events.stream()
                    .map(this::convertToDto)
                    .toList();
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 목록 조회 중 오류가 발생했습니다.");
        }
    }

    public EventDto getEventById(String eventId) {
        try {
            return eventRepository.findById(eventId)
                    .map(this::convertToDto)
                    .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND, "이벤트를 찾을 수 없습니다."));
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 조회 중 오류가 발생했습니다.");
        }
    }

    public EventDto createEvent(EventDto eventDto) {
        // 조건문을 변수로 분리하여 가독성 향상
        boolean isInvalidDateRange = !"true".equals(eventDto.getIsOngoing())
                && !"true".equals(eventDto.getNoEndDate())
                && eventDto.getStartDate() != null
                && eventDto.getEndDate() != null
                && eventDto.getStartDate().isAfter(eventDto.getEndDate());

        // 날짜 유효성 검증 실패 시 예외 던짐
        if (isInvalidDateRange) {
            throw new CustomException(ErrorCode.EVENT_NOT_FOUND, "시작일은 종료일보다 이후일 수 없습니다.");
        }

        try {
            Event event = convertToEntity(eventDto);
            if ("상시".equals(event.getEventType())) {
                event.setStartDate(null);
                event.setEndDate(null);
            } else if ("종료일 미정".equals(event.getEventType())) {
                event.setStartDate(eventDto.getStartDate());
                event.setEndDate(null);
            } else {
                event.setStartDate(eventDto.getStartDate());
                event.setEndDate(eventDto.getEndDate());
            }

            Event savedEvent = eventRepository.save(event);
            return convertToDto(savedEvent);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 생성 중 오류가 발생했습니다.");
        }
    }

    public EventDto updateEvent(String eventId, EventDto eventDto) {
        // 조건문을 변수로 분리하여 가독성 향상
        boolean isInvalidDateRange = !"true".equals(eventDto.getIsOngoing())
                && !"true".equals(eventDto.getNoEndDate())
                && eventDto.getStartDate() != null
                && eventDto.getEndDate() != null
                && eventDto.getStartDate().isAfter(eventDto.getEndDate());

        // 날짜 유효성 검증 실패 시 예외 던짐
        if (isInvalidDateRange) {
            throw new CustomException(ErrorCode.EVENT_NOT_FOUND, "시작일은 종료일보다 이후일 수 없습니다.");
        }

        try {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND, "이벤트를 찾을 수 없습니다."));

            // 업데이트 로직
            event.setTitle(eventDto.getTitle());
            event.setDescription(eventDto.getDescription());
            event.setIsOngoing(eventDto.getIsOngoing());
            event.setNoEndDate(eventDto.getNoEndDate());

            if ("true".equals(event.getIsOngoing())) { // 상시 이벤트 처리
                event.setStartDate(null);
                event.setEndDate(null);
            } else if ("true".equals(event.getNoEndDate())) { // 종료 기한 없는 이벤트 처리
                event.setStartDate(eventDto.getStartDate());
                event.setEndDate(null);
            } else { // 일반 이벤트 처리
                event.setStartDate(eventDto.getStartDate());
                event.setEndDate(eventDto.getEndDate());
            }

            Event updatedEvent = eventRepository.save(event);
            return convertToDto(updatedEvent);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 수정 중 오류가 발생했습니다.");
        }
    }

    public void deleteEvent(String eventId) {
        try {
            if (!eventRepository.existsById(eventId)) {
                throw new CustomException(ErrorCode.EVENT_NOT_FOUND, "이벤트를 찾을 수 없습니다.");
            }
            eventRepository.deleteById(eventId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 삭제 중 오류가 발생했습니다.");
        }
    }

    // XXX: convert 관련 메서드는 제거 후 사용 위치에서는 modelMapper 사용하는 형태로 수정해 주세요.
    private EventDto convertToDto(Event event) {
        return new EventDto(
                event.getEventId(),
                event.getTitle(),
                event.getDescription(),
                event.getStartDate(),
                event.getEndDate(),
                event.getIsOngoing(),
                event.getNoEndDate(),
                event.getEventType());
    }

    // XXX: convert 관련 메서드는 제거 후 사용 위치에서는 modelMapper 사용하는 형태로 수정해 주세요.
    private Event convertToEntity(EventDto eventDto) {
        return new Event(
                eventDto.getEventId(),
                eventDto.getTitle(),
                eventDto.getDescription(),
                eventDto.getStartDate(),
                eventDto.getEndDate(),
                eventDto.getIsOngoing(),
                eventDto.getNoEndDate(),
                eventDto.getEventType());
    }
}
