package com.baeksutalchul.hiddendoor.event.controller;

import com.baeksutalchul.hiddendoor.dto.EventDto;
import com.baeksutalchul.hiddendoor.event.service.EventService;
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

    // XXX: service 레이어에서 ResposneDto를 반환하는 형태로 수정해 주세요.
    @GetMapping
    public ResponseEntity<ResponseDto<List<EventDto>>> getEventAll() {
        List<EventDto> events = eventService.getAllEvents();
        return ResponseEntity.ok().body(new ResponseDto<>(events, "이벤트 목록을 성공적으로 조회했습니다."));
    }

    // XXX: service 레이어에서 ResposneDto를 반환하는 형태로 수정해 주세요.
    @GetMapping("/{eventId}")
    public ResponseEntity<ResponseDto<EventDto>> getEventOne(@PathVariable String eventId) {
        EventDto event = eventService.getEventById(eventId);
        return ResponseEntity.ok().body(new ResponseDto<>(event, "이벤트를 성공적으로 조회했습니다."));
    }

    // XXX: service 레이어에서 ResposneDto를 반환하는 형태로 수정해 주세요.
    @PostMapping
    public ResponseEntity<ResponseDto<EventDto>> addEvent(@RequestBody EventDto eventDto) {
        EventDto createdEvent = eventService.createEvent(eventDto);
        return ResponseEntity.ok().body(new ResponseDto<>(createdEvent, "이벤트가 성공적으로 추가되었습니다."));
    }

    // XXX: service 레이어에서 ResposneDto를 반환하는 형태로 수정해 주세요.
    @PutMapping("/{eventId}")
    public ResponseEntity<ResponseDto<EventDto>> updateEventOne(@PathVariable("eventId") String eventId,
            @RequestBody EventDto eventDto) {
        EventDto updatedEvent = eventService.updateEvent(eventId, eventDto);
        return ResponseEntity.ok().body(new ResponseDto<>(updatedEvent, "이벤트가 성공적으로 수정되었습니다."));
    }

    // XXX: service 레이어에서 ResposneDto를 반환하는 형태로 수정해 주세요.
    @DeleteMapping("/{eventId}")
    public ResponseEntity<ResponseDto<String>> deleteEventOne(@PathVariable("eventId") String eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.ok().body(new ResponseDto<>("", "이벤트가 성공적으로 삭제되었습니다."));
    }
}
