package com.baeksutalchul.hiddendoor.customer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.customer.domain.Customer;


@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
  List<Customer> findAll();

  Optional<Customer> findById(String id);

  boolean existsById(String id);

  void deleteById(String id); 

  Page<Customer> findByCustomerTitleContaining(String customerTitle, Pageable pageable);

  Page<Customer> findByCustomerContentContaining(String customerContent, Pageable pageable);

  Page<Customer> findByCustomerTitleContainingOrCustomerContentContaining(String customerTitle, String customerContent, Pageable pageable);
}