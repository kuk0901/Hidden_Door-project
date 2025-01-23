package com.baeksutalchul.hiddendoor.escapeRoom.repository;

import java.util.List;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.escapeRoom.domain.EscapeRoom;

@Repository
public interface EscapeRoomRepository extends MongoRepository<EscapeRoom, String> {
  List<EscapeRoom> findAll();

  Optional<EscapeRoom> findById(String id);
}
