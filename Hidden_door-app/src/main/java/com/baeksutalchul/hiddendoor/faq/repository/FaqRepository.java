package com.baeksutalchul.hiddendoor.faq.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.faq.domain.Faq;


@Repository
public interface FaqRepository extends MongoRepository<Faq, String> {
  List<Faq> findAll();

}