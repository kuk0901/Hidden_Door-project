package com.baeksutalchul.hiddendoor.token;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;

import java.security.Key;
import java.util.Date;
import java.util.List;

@Service
public class TokenService {
  private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

  @Value("${custom.jwt.secretKey}")
  private String secretKey;

  private Key getSigningKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes());
  }

  // accessToken 생성
  public String generateToken(String id, List<String> roles) {
    return Jwts.builder()
        .setSubject(id)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        // FIXME: 테스트 중
        .setExpiration(new Date(System.currentTimeMillis() + (1000L * 60 * 45))) // 45분 유효
        .claim("roles", roles)
        .claim("tokenType", "ACCESS")
        .signWith(getSigningKey())
        .compact();
  }

  // refreshToken 생성
  public String generateRefreshToken(String id) {
    return Jwts.builder()
        .setSubject(id)
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
    } catch (ExpiredJwtException e) {
      logger.error("Token is expired", e);
      throw new CustomException(ErrorCode.ACCESS_TOKEN_EXPIRED);
    } catch (Exception e) {
      logger.error("Error validating token", e);
      throw new CustomException(ErrorCode.INVALID_TOKEN);
    }
  }

  // 토큰 유효성 검사 및 권한 확인 (액세스 토큰용)
  public boolean validateTokenAndAuthority(String token, String id) {
    try {
      Claims claims = extractAllClaims(token);
      return claims.getSubject().equals(id)
          && !isTokenExpired(token)
          && "ACCESS".equals(claims.get("tokenType"))
          && hasAdminAuthority(token);
    } catch (Exception e) {
      logger.error("토큰 검증 중 오류 발생: {}", e.getMessage());
      return false;
    }
  }

  // 토큰 유효성 검사 (리프레시 토큰용)
  public boolean validateRefreshToken(String token) {
    logger.info("리프레시 토큰 유효성 검사: {}", token);

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

  // 토큰에서 역할 정보 추출
  public List<String> extractRoles(String token) {
    Claims claims = extractAllClaims(token);
    return claims.get("roles", List.class);
  }

  // 특정 역할을 가지고 있는지 확인
  public boolean hasRole(String token, String role) {
    List<String> roles = extractRoles(token);
    return roles != null && roles.contains(role);
  }

  // 토큰이 ADMIN 또는 SUPER_ADMIN 권한을 가지고 있는지 확인
  public boolean hasAdminAuthority(String token) {
    List<String> roles = extractRoles(token);
    return roles != null && (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_SUPER_ADMIN"));
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

  // 토큰 만료 5분 전인지 확인
  public boolean isTokenNearExpiration(String token) {
    logger.info("토큰 만료 5분 전인지 확인: {}", token);
    Date expiration = extractAllClaims(token).getExpiration();
    Date now = new Date();

    // 만료 5분 전부터 갱신 시도
    return (expiration.getTime() - now.getTime()) <= 5 * 60 * 1000;
  }
}
