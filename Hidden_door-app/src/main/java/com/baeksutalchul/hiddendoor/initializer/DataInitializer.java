package com.baeksutalchul.hiddendoor.initializer;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.baeksutalchul.hiddendoor.admin.domain.Admin;
import com.baeksutalchul.hiddendoor.admin.repository.AdminRepository;

import com.baeksutalchul.hiddendoor.token.TokenService;

@Component
public class DataInitializer implements CommandLineRunner {
  private final AdminRepository adminRepository;
  private final PasswordEncoder passwordEncoder;
  private final TokenService tokenService;

  @Value("${ADMIN_EMAIL}")
  private String adminEmail;

  @Value("${ADMIN_PASSWORD}")
  private String adminPassword;

  @Value("${TEST_ADMIN_EMAIL}")
  private String testAdminEmail;

  @Value("${TEST_ADMIN_PASSWORD}")
  private String testAdminPassword;

  public DataInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
    this.adminRepository = adminRepository;
    this.passwordEncoder = passwordEncoder;
    this.tokenService = tokenService;
  }

  @Override
  public void run(String... args) {

    if (adminRepository.count() == 0) {
      Admin superAdmin = new Admin();
      superAdmin.setEmail(adminEmail);
      superAdmin.setUserName("전체 관리자");
      superAdmin.setPwd(passwordEncoder.encode(adminPassword));
      superAdmin.setRoles(Arrays.asList("ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_USER"));

      superAdmin.setToken(tokenService.generateToken(superAdmin.getEmail(), superAdmin.getRoles())); // JWT 생성

      adminRepository.save(superAdmin);

      Admin testAdmin = new Admin();
      testAdmin.setEmail(testAdminEmail);
      testAdmin.setUserName("관리자1");
      testAdmin.setPwd(passwordEncoder.encode(testAdminPassword));
      testAdmin.setRoles(Arrays.asList("ROLE_ADMIN", "ROLE_USER"));

      testAdmin.setToken(tokenService.generateToken(testAdmin.getEmail(), testAdmin.getRoles())); // JWT 생성

      adminRepository.save(testAdmin);

    }

  }
}
