package com.baeksutalchul.hiddendoor.reservation.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reservation")
public class Reservation {
  @Id
  private String reservationId;
  private String themeId;
  private String name;
  private String phone;
  private String email;
  private Date reservationDate;
  private Date reservationCreDate;
  private String availability;
  private int paymentAmount;
  private String paymentState;
  private String paymentMethod;
  private Date paymentDate;
  private String refundState;
}
