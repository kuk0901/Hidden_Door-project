package com.baeksutalchul.hiddendoor.timeSlot.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.baeksutalchul.hiddendoor.timeSlot.domain.TimeSlot;

public interface TimeSlotRepository extends MongoRepository<TimeSlot, String> {
  Optional<TimeSlot> findByThemeIdAndDate(String themeId, String date);
  
}
