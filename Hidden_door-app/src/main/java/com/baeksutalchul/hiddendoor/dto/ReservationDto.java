package com.baeksutalchul.hiddendoor.dto;

import java.time.Instant;
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
public class ReservationDto {
  @Id
  private String reservationId;
  private String themeId;
  private String name;
  private String phone;
  private String email;
  private Instant reservationDate;
  private Instant reservationCreDate;
  private String availability;
  private int paymentAmount;
  private String paymentState;
  private String paymentMethod;
  private Instant paymentDate;
  private String refundState;
  private String kstResDate;
  private String kstResCreDate;
  private String kstPayDate;
}
