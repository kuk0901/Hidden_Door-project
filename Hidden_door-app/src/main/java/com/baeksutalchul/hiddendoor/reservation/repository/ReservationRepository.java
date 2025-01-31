package com.baeksutalchul.hiddendoor.reservation.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.reservation.domain.Reservation;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
  List<Reservation> findAll();
}
