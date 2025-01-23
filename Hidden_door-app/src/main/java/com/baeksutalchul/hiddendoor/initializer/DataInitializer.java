package com.baeksutalchul.hiddendoor.initializer;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.baeksutalchul.hiddendoor.admin.domain.Admin;
import com.baeksutalchul.hiddendoor.admin.repository.AdminRepository;
import com.baeksutalchul.hiddendoor.reservation.domain.Reservation;
import com.baeksutalchul.hiddendoor.reservation.repository.ReservationRepository;
import com.baeksutalchul.hiddendoor.token.TokenService;

@Component
public class DataInitializer implements CommandLineRunner {
  private final AdminRepository adminRepository;
  private final PasswordEncoder passwordEncoder;
  private final TokenService tokenService;
  private final ReservationRepository reservationRepository;

  @Value("${ADMIN_EMAIL}")
  private String adminEmail;

  @Value("${ADMIN_PASSWORD}")
  private String adminPassword;

  @Value("${TEST_ADMIN_EMAIL}")
  private String testAdminEmail;

  @Value("${TEST_ADMIN_PASSWORD}")
  private String testAdminPassword;

  public DataInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder, TokenService tokenService, ReservationRepository reservationRepository) {
    this.adminRepository = adminRepository;
    this.passwordEncoder = passwordEncoder;
    this.tokenService = tokenService;
    this.reservationRepository = reservationRepository;
  }

  @Override
  public void run(String... args) {

    if (adminRepository.count() == 0) {
      Admin superAdmin = new Admin();
      superAdmin.setEmail(adminEmail);
      superAdmin.setUserName("전체 관리자");
      superAdmin.setPwd(passwordEncoder.encode(adminPassword));
      superAdmin.setRoles(Arrays.asList("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_USER"));

      superAdmin.setToken(tokenService.generateToken(superAdmin.getEmail())); // JWT 생성

      adminRepository.save(superAdmin);

      Admin testAdmin = new Admin();
      testAdmin.setEmail(testAdminEmail);
      testAdmin.setUserName("관리자1");
      testAdmin.setPwd(passwordEncoder.encode(testAdminPassword));
      testAdmin.setRoles(Arrays.asList("ROLE_ADMIN", "ROLE_USER"));

      testAdmin.setToken(tokenService.generateToken(testAdmin.getEmail())); // JWT 생성

      adminRepository.save(testAdmin);

    }

    if (reservationRepository.count() == 0) {
      Reservation rs = new Reservation();

      // 현재 날짜 및 시간 생성 (예약 생성 날짜로 사용)
      Date now = new Date();
      
      // 예약 날짜를 7일 후로 설정
      Calendar calendar = Calendar.getInstance();
      calendar.setTime(now);
      calendar.add(Calendar.DAY_OF_MONTH, 7);
      Date reservationDate = calendar.getTime();

      rs.setThemeId("1");
      rs.setName("김보근");
      rs.setPhone("010-3034-3198");
      rs.setEmail("kbg@gmail.com");
      rs.setReservationDate(reservationDate);
      rs.setReservationCreDate(now);
      rs.setAvailability("N");
      rs.setPaymentAmount(30000);
      rs.setPaymentState("N");
      rs.setPaymentMethod("현장결제");
      rs.setPaymentDate(null);
      rs.setRefundState("N");

      reservationRepository.save(rs);
    }

  }
}
