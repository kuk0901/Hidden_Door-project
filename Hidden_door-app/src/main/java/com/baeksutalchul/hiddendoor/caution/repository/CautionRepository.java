package com.baeksutalchul.hiddendoor.caution.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.caution.domain.Caution;

@Repository
public interface CautionRepository extends MongoRepository<Caution, String> {
  List<Caution> findAll();

  Optional<Caution> findById(String id);

  void deleteById(String id);
}
