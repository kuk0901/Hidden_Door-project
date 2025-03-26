package com.baeksutalchul.hiddendoor.auth.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.admin.service.AdminService;
import com.baeksutalchul.hiddendoor.dto.AdminDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.token.TokenService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  private final AdminService adminService;
  private final TokenService tokenService;

  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

  public AuthController(AdminService adminService, TokenService tokenService) {
    this.adminService = adminService;
    this.tokenService = tokenService;
  }

  @PostMapping("/register")
  public ResponseEntity<ResponseDto<AdminDto>> signUp(@RequestBody AdminDto adminDto) {
    return ResponseEntity.ok().body(adminService.registerUser(adminDto));

  }

  @PostMapping("/authenticate")
  public ResponseEntity<ResponseDto<AdminDto>> login(@RequestBody AdminDto adminDto, HttpServletResponse response) {
    ResponseDto<AdminDto> responseDto = adminService.login(adminDto.getEmail(), adminDto.getPwd(), response);
    return ResponseEntity.ok(responseDto);

  }

  @PostMapping("/terminate")
  public ResponseEntity<Void> signout(HttpServletResponse response) {

    // 쿠키에서 리프레시 토큰 삭제
    Cookie cookie = new Cookie("refreshToken", null);
    cookie.setHttpOnly(true);
    cookie.setSecure(false); // HTTPS 사용 시 true로 변경
    cookie.setPath("/");
    cookie.setMaxAge(0); // 쿠키 만료 설정

    response.addCookie(cookie); // 쿠키 삭제
    return ResponseEntity.ok().build(); // 응답을 비움
  }

  @PostMapping("/renew")
  public ResponseEntity<ResponseDto<String>> refresh(@CookieValue("refreshToken") String refreshToken) {

    if (!tokenService.validateRefreshToken(refreshToken)) {
      throw new CustomException(ErrorCode.REFRESH_TOKEN_EXPIRED);
    }

    String newAccessToken = adminService.refreshAccessToken(refreshToken); // 리프레시 토큰으로 액세스 토큰 갱신
    return ResponseEntity.ok(new ResponseDto<>(newAccessToken, "", "액세스 토큰이 갱신되었습니다."));
  }

  @GetMapping("/verify")
  public ResponseEntity<ResponseDto<AdminDto>> getUserInfo(@RequestHeader("Authorization") String authorization) {
    // Authorization 헤더에서 Bearer 토큰 추출
    String token = authorization.substring(7);
    AdminDto adminDto = adminService.getUserInfoByToken(token);

    return ResponseEntity.ok(new ResponseDto<>(adminDto, "사용자 정보 조회 성공"));
  }
}
