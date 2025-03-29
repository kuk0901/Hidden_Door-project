package com.baeksutalchul.hiddendoor.token;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

import java.io.IOException;

import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.baeksutalchul.hiddendoor.admin.repository.AdminRepository;
import com.baeksutalchul.hiddendoor.admin.service.AdminService;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

  private final AdminRepository adminRepository;
  private final TokenService tokenService;
  private final AdminService adminService;

  private volatile boolean isRefreshing = false;
  private final Object refreshLock = new Object();
  private volatile String latestToken = "";

  public TokenAuthenticationFilter(TokenService tokenService, AdminRepository adminRepository,
      AdminService adminService) {
    this.tokenService = tokenService;
    this.adminRepository = adminRepository;
    this.adminService = adminService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain)
      throws ServletException, IOException {
    String token = extractToken(req);

    // ExpiredJwtException 에러 이후 요청
    if ("true".equals(req.getHeader("X-Refresh-Token"))) {
      filterChain.doFilter(req, res);
      return;
    }

    if (token != null) {
      try {
        // 토큰 만료 임박인 경우
        token = checkAndRefreshToken(req, res, token);

        String adminId = tokenService.extractEmail(token);

        // 토큰 검증 및 인증 정보 설정
        if (tokenService.validateToken(token, adminId)) {
          List<String> roles = tokenService.extractRoles(token);

          setAuthentication(adminId, roles); // 인증 정보 설정
        }

      } catch (ExpiredJwtException e) {
        // 토큰이 만료된 경우
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setHeader("Token-Expired", "true");
        sendErrorResponse(res, ErrorCode.ACCESS_TOKEN_EXPIRED);
        return;
      } catch (JwtException e) {
        sendErrorResponse(res, ErrorCode.UNAUTHORIZED_ACCESS);
        return;
      } catch (Exception e) {
        sendErrorResponse(res, ErrorCode.INTERNAL_SERVER_ERROR);
        return;
      }
    }

    filterChain.doFilter(req, res);
  }

  private void setAuthentication(String adminId, List<String> roles) {
    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(adminId, null,
        roles.stream()
            .map(role -> new SimpleGrantedAuthority(role))
            .toList());

    SecurityContextHolder.getContext().setAuthentication(authentication);
  }

  /**
   * HTTP 요청의 Authorization 헤더에서 Bearer 토큰 추출
   *
   * @param request HTTP 요청 객체
   * @return 추출된 토큰 문자열, 없으면 null
   */
  private String extractToken(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }

  /**
   * 토큰의 만료가 임박했는지 확인하고, 필요시 갱신
   *
   * @param req   HTTP 요청 객체
   * @param res   HTTP 응답 객체
   * @param token 현재 토큰
   * @return 갱신된 토큰 또는 기존 토큰
   * @throws Exception 토큰 갱신 중 발생할 수 있는 예외
   */

  private String checkAndRefreshToken(HttpServletRequest req, HttpServletResponse res, String token) throws Exception {
    if (tokenService.isTokenNearExpiration(token)) {
      synchronized (refreshLock) {
        if (isRefreshing) {
          while (isRefreshing) {
            refreshLock.wait(100);
          }
          return latestToken.isEmpty() ? token : latestToken; // 이미 갱신 중이면 최신 토큰 반환
        }
        isRefreshing = true;
      }

      try {
        String refreshToken = getRefreshTokenFromCookie(req);
        if (refreshToken != null && tokenService.validateRefreshToken(refreshToken)) {
          String adminId = tokenService.extractEmail(token);
          List<String> roles = tokenService.extractRoles(token);
          String newToken = tokenService.generateToken(adminId, roles);

          res.setHeader("Authorization", "Bearer " + newToken);
          res.setHeader("Token-Refreshed", "true");

          latestToken = newToken; // 최신 토큰 저장
          return newToken; // 갱신된 토큰 반환
        }
      } finally {
        synchronized (refreshLock) {
          isRefreshing = false; // 갱신 완료 후 플래그 초기화
          latestToken = ""; // 사용 후 초기화
          refreshLock.notifyAll(); // 대기 중인 스레드 깨우기
        }
      }
    }
    return token; // 기존 토큰 반환
  }

  /**
   * HTTP 요청의 쿠키에서 리프레시 토큰을 추출
   *
   * @param request HTTP 요청 객체
   * @return 추출된 리프레시 토큰, 없으면 null
   */
  private String getRefreshTokenFromCookie(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if ("refreshToken".equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }

  /**
   * 에러 응답을 클라이언트에게 전송
   *
   * @param res       HTTP 응답 객체
   * @param errorCode 에러 코드 enum
   * @throws IOException 입출력 예외
   */
  private void sendErrorResponse(HttpServletResponse res, ErrorCode errorCode) throws IOException {
    res.setStatus(errorCode.getHttpStatus().value());
    res.setCharacterEncoding("UTF-8");
    res.getWriter().write(String.format(
        "{\"error\":\"%s\",\"code\":\"%s\",\"message\":\"%s\",\"status\":%d}",
        errorCode.name(), errorCode.getCode(), errorCode.getMsg(), errorCode.getHttpStatus().value()));
  }
}
