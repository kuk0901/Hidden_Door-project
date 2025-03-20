package com.baeksutalchul.hiddendoor.event.controller;

import com.baeksutalchul.hiddendoor.dto.EventDto;
import com.baeksutalchul.hiddendoor.event.service.EventService;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;    

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ResponseDto<List<EventDto>>> getEventAll() {
        try {
            List<EventDto> events = eventService.getAllEvents();
            return ResponseEntity.ok().body(new ResponseDto<>(events, "이벤트 목록을 성공적으로 조회했습니다."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>(null, "서버 오류로 인해 이벤트 목록 조회에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto<EventDto>> getEventOne(@PathVariable String id) {
        try {
            EventDto event = eventService.getEventById(id);
            return ResponseEntity.ok().body(new ResponseDto<>(event, "이벤트를 성공적으로 조회했습니다."));
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ResponseDto<>(null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>(null, "서버 오류로 인해 이벤트 조회에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    @PostMapping
    public ResponseEntity<ResponseDto<EventDto>> addEvent(@RequestBody EventDto eventDto) {        try {
            
            EventDto createdEvent = eventService.createEvent(eventDto);
            return ResponseEntity.ok().body(new ResponseDto<>(createdEvent, "이벤트가 성공적으로 추가되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>(null, "서버 오류로 인해 이벤트 추가에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDto<EventDto>> updateEventOne(@PathVariable("id") String id, @RequestBody EventDto eventDto) {
        try {
            EventDto updatedEvent = eventService.updateEvent(id, eventDto);
            return ResponseEntity.ok().body(new ResponseDto<>(updatedEvent, "이벤트가 성공적으로 수정되었습니다."));
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ResponseDto<>(null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>(null, "서버 오류로 인해 이벤트 수정에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto<String>> deleteEventOne(@PathVariable("id") String id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok().body(new ResponseDto<>("", "이벤트가 성공적으로 삭제되었습니다."));
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ResponseDto<>("", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>("", "서버 오류로 인해 이벤트 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }
}
