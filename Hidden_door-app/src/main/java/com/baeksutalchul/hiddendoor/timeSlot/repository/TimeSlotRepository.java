package com.baeksutalchul.hiddendoor.timeSlot.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.baeksutalchul.hiddendoor.timeSlot.domain.TimeSlot;

public interface TimeSlotRepository extends MongoRepository<TimeSlot, String> {

  Optional<TimeSlot> findByThemeIdAndDate(String themeId, String date);

  List<TimeSlot> findByDate(String date);

  List<TimeSlot> findByDateAndThemeId(String date, String themeId);

  List<TimeSlot> findByThemeId(String themeId);

  List<TimeSlot> findByDateIn(List<String> dates);
  
  void deleteByDateIn(List<String> dates);

}
