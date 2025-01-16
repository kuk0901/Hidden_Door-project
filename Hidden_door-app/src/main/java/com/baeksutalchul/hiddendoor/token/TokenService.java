package com.baeksutalchul.hiddendoor.token;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class TokenService {
  private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

  @Value("${custom.jwt.secretKey}")
  private String secretKey;

  private Key getSigningKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes());
  }

  // accessToken 생성
  public String generateToken(String userEmail) {
    return Jwts.builder()
        .setSubject(userEmail)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + (1000L * 60 * 45))) // 45분 유효
        .claim("tokenType", "ACCESS")
        .signWith(getSigningKey())
        .compact();
  }

  // refreshToken 생성
  public String generateRefreshToken(String userEmail) {
    return Jwts.builder()
        .setSubject(userEmail)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + (1000L * 60 * 60 * 24 * 100))) // 100일 유효
        .claim("tokenType", "REFRESH")
        .signWith(getSigningKey())
        .compact();
  }

  // 토큰 유효성 검사 (액세스 토큰용)
  public boolean validateToken(String token, String userEmail) {
    try {
      Claims claims = extractAllClaims(token);
      return claims.getSubject().equals(userEmail)
          && !isTokenExpired(token)
          && "ACCESS".equals(claims.get("tokenType"));
    } catch (Exception e) {
      return false;
    }
  }

  // 토큰 유효성 검사 (리프레시 토큰용)
  public boolean validateRefreshToken(String token) {
    try {
      Claims claims = extractAllClaims(token);
      boolean isExpired = isTokenExpired(token);
      boolean isValidType = "REFRESH".equals(claims.get("tokenType"));

      if (isExpired || !isValidType) {
        logger.warn("리프레시 토큰 유효성 검사 실패 - 만료 여부: {}, 유형 일치 여부: {}", isExpired, isValidType);
        return false;
      }

      return true;
    } catch (Exception e) {
      logger.error("리프레시 토큰 검증 중 오류 발생: {}", e.getMessage());
      return false;
    }
  }

  // JWT를 디코딩하여 email 추출
  public String extractEmail(String token) {
    return extractAllClaims(token).getSubject();
  }

  // JWT의 페이로드에 포함된 클레임(claims)을 가져옴
  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  // 유효기간 확인
  private boolean isTokenExpired(String token) {
    return extractAllClaims(token).getExpiration().before(new Date());
  }
}
