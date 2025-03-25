package com.baeksutalchul.hiddendoor.event.service;

import java.util.List;
import java.util.Optional;
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
        List<Event> events = eventRepository.findAll();
        return events.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public EventDto getEventById(String id) {
        Optional<Event> eventOptional = eventRepository.findById(id);
        if (eventOptional.isPresent()) {
            return convertToDto(eventOptional.get());
        } else {
            throw new CustomException(ErrorCode.EVENT_NOT_FOUND);
        }
    }

    public EventDto createEvent(EventDto eventDto) {
        Event event = convertToEntity(eventDto);
        Event savedEvent = eventRepository.save(event);
        return convertToDto(savedEvent);
    }
    

    public EventDto updateEvent(String id, EventDto eventDto) {
        Event event = eventRepository.findById(id)
            .orElseThrow(() -> new CustomException(ErrorCode.EVENT_NOT_FOUND));
        
        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setStartDate(eventDto.getStartDate());
        event.setEndDate(eventDto.getEndDate());
        
        Event updatedEvent = eventRepository.save(event);
        return convertToDto(updatedEvent);
    }

    public void deleteEvent(String id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
        } else {
            throw new CustomException(ErrorCode.EVENT_NOT_FOUND);
        }
    }

    private EventDto convertToDto(Event event) {
        return new EventDto(event.getId(), event.getTitle(), event.getDescription(), event.getStartDate(), event.getEndDate());
    }

    private Event convertToEntity(EventDto eventDto) {
        return new Event(eventDto.getId(), eventDto.getTitle(), eventDto.getDescription(), eventDto.getStartDate(), eventDto.getEndDate());
    }
}
