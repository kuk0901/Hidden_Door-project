package com.baeksutalchul.hiddendoor.reservation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.baeksutalchul.hiddendoor.reservation.domain.Reservation;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
  List<Reservation> findAll();

  Optional<Reservation> findById(String id);

  List<Reservation> findByReservationDateAndThemeId(String reservationDate, String themeId);

  Optional<Reservation> findByReservationNumber(String reservationNumber);

  boolean existsByReservationNumberAndName(String reservationNumber, String name);

  Page<Reservation> findByNameContainingOrderByReservationCreDateAsc(String name, Pageable pageable);

  Page<Reservation> findByThemeIdInOrderByReservationCreDateAsc(List<String> themeIds, Pageable pageable);

  Page<Reservation> findByNameContainingOrThemeIdInOrderByReservationCreDateAsc(String name, List<String> themeIds,
      Pageable pageable);

  Page<Reservation> findAllByOrderByReservationCreDateAsc(Pageable pageable);

  void deleteByReservationNumberIn(List<String> reservationNumbers);
}
