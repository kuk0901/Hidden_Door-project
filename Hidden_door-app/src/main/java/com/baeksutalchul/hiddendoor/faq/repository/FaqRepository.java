package com.baeksutalchul.hiddendoor.faq.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.faq.domain.Faq;


@Repository
public interface FaqRepository extends MongoRepository<Faq, String> {
  List<Faq> findAll();

  Optional<Faq> findById(String id);

  boolean existsById(String id);

  void deleteById(String id);
}