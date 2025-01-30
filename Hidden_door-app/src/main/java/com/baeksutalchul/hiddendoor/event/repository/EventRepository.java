package com.baeksutalchul.hiddendoor.event.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.event.domain.Event;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
}
