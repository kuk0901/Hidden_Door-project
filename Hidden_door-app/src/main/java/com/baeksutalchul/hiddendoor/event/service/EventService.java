package com.baeksutalchul.hiddendoor.event.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.event.domain.Event;
import com.baeksutalchul.hiddendoor.event.repository.EventRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.dto.EventDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ModelMapper modelMapper;

    public EventService(EventRepository eventRepository, ModelMapper modelMapper) {
        this.eventRepository = eventRepository;
        this.modelMapper = modelMapper;
    }

    public ResponseDto<List<EventDto>> getAllEvents() {
        try {
            List<Event> events = eventRepository.findAll();
            List<EventDto> eventDtos = events.stream()
                    .map(event -> modelMapper.map(event, EventDto.class))
                    .toList();
            return new ResponseDto<>(eventDtos, "이벤트 목록을 성공적으로 조회했습니다.");
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 목록 조회 중 오류가 발생했습니다.");
        }
    }

    public ResponseDto<EventDto> getEventById(String eventId) {
        try {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND, "이벤트를 찾을 수 없습니다."));
            EventDto eventDto = modelMapper.map(event, EventDto.class);
            return new ResponseDto<>(eventDto, "이벤트를 성공적으로 조회했습니다.");
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 조회 중 오류가 발생했습니다.");
        }
    }

    public ResponseDto<EventDto> createEvent(EventDto eventDto) {
        validateDates(eventDto);
    
        try {
            Event event = modelMapper.map(eventDto, Event.class);    
            
            adjustDates(event, eventDto);
    
            Event savedEvent = eventRepository.save(event);
            EventDto savedEventDto = modelMapper.map(savedEvent, EventDto.class);
            return new ResponseDto<>(savedEventDto, "이벤트가 성공적으로 추가되었습니다.");
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 생성 중 오류가 발생했습니다.");
        }
    }
    

    // public ResponseDto<EventDto> updateEvent(String eventId, EventDto eventDto) {
    //     validateDates(eventDto);

    //     try {
    //         Event existingEvent = eventRepository.findById(eventId)
    //                 .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND, "이벤트를 찾을 수 없습니다."));
            
    //         modelMapper.map(eventDto, existingEvent); 
    //         adjustDates(existingEvent, eventDto);

    //         Event updatedEvent = eventRepository.save(existingEvent);
    //         EventDto updatedEventDto = modelMapper.map(updatedEvent, EventDto.class);
    //         return new ResponseDto<>(updatedEventDto, "이벤트가 성공적으로 수정되었습니다.");
    //     } catch (Exception e) {
    //         throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 수정 중 오류가 발생했습니다.");
    //     }
    // }


    // 확인 후 수동으로 말고 모델로 변환하기
    public ResponseDto<EventDto> updateEvent(String eventId, EventDto eventDto) {
        validateDates(eventDto);
    
        try {
            Event existingEvent = eventRepository.findById(eventId)
                    .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND, "이벤트를 찾을 수 없습니다."));
                        
            existingEvent.setTitle(eventDto.getTitle());
            existingEvent.setDescription(eventDto.getDescription());
            existingEvent.setIsOngoing(eventDto.getIsOngoing());
            existingEvent.setNoEndDate(eventDto.getNoEndDate());
                
            adjustDates(existingEvent, eventDto);
    
            Event updatedEvent = eventRepository.save(existingEvent);
            EventDto updatedEventDto = modelMapper.map(updatedEvent, EventDto.class);
            return new ResponseDto<>(updatedEventDto, "이벤트가 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 수정 중 오류가 발생했습니다.");
        }
    }
    
    

    public ResponseDto<String> deleteEvent(String eventId) {
        try {
            if (!eventRepository.existsById(eventId)) {
                throw new CustomException(ErrorCode.EVENT_NOT_FOUND, "이벤트를 찾을 수 없습니다.");
            }
            eventRepository.deleteById(eventId);
            return new ResponseDto<>("", "이벤트가 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "이벤트 삭제 중 오류가 발생했습니다.");
        }
    }

   private void validateDates(EventDto eventDto) { 
       boolean isInvalidDateRange = !"true".equals(eventDto.getIsOngoing())
                && !"true".equals(eventDto.getNoEndDate())
                && eventDto.getStartDate() != null
                && eventDto.getEndDate() != null
                && eventDto.getStartDate().isAfter(eventDto.getEndDate());

       if (isInvalidDateRange) { 
           throw new CustomException(ErrorCode.EVENT_NOT_FOUND, "시작일은 종료일보다 이후일 수 없습니다."); 
       } 
   }

   private void adjustDates(Event entity, EventDto dto) {
        if ("상시".equals(dto.getEventType())) { 
            entity.setStartDate(null); 
            entity.setEndDate(null); 
        } else if ("종료일 미정".equals(dto.getEventType())) { 
            entity.setStartDate(dto.getStartDate()); 
            entity.setEndDate(null); 
        } else { 
            entity.setStartDate(dto.getStartDate()); 
            entity.setEndDate(dto.getEndDate()); 
        }
    }

}
