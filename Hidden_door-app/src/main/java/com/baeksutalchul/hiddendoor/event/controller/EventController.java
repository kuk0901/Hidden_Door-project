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

    @GetMapping
    public ResponseEntity<ResponseDto<List<EventDto>>> getEventAll() {
        return ResponseEntity.ok().body(eventService.getAllEvents());
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<ResponseDto<EventDto>> getEventOne(@PathVariable("eventId") String eventId) {
        return ResponseEntity.ok().body(eventService.getEventById(eventId));
    }

    @PostMapping
    public ResponseEntity<ResponseDto<EventDto>> addEvent(@RequestBody EventDto eventDto) {
        return ResponseEntity.ok().body(eventService.createEvent(eventDto));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<ResponseDto<EventDto>> updateEventOne(
            @PathVariable("eventId") String eventId,
            @RequestBody EventDto eventDto) {
        return ResponseEntity.ok().body(eventService.updateEvent(eventId, eventDto));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<ResponseDto<String>> deleteEventOne(@PathVariable("eventId") String eventId) {
        return ResponseEntity.ok().body(eventService.deleteEvent(eventId));
    }
}
