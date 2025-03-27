package com.baeksutalchul.hiddendoor.token;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

import java.io.IOException;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
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
  private volatile String latestToken = null;

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

    if (token != null) {
      try {
        // 토큰 만료 임박인 경우
        token = checkAndRefreshToken(req, res, token);
        setAuthentication(req, token);
      } catch (ExpiredJwtException e) {
        // 토큰이 만료된 경우
        // FIXME: 만료후 액세스 토큰 갱신에서 에러 발생 중
        token = handleExpiredAccessToken(req, res);
        if (token != null) {
          setAuthentication(req, token);
        }
      } catch (JwtException e) {
        sendErrorResponse(res, ErrorCode.UNAUTHORIZED_ACCESS);
      } catch (Exception e) {
        sendErrorResponse(res, ErrorCode.INTERNAL_SERVER_ERROR);
      }
    }

    filterChain.doFilter(req, res);
  }

  private String extractToken(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7);
    }
    return null;
  }

  private String checkAndRefreshToken(HttpServletRequest req, HttpServletResponse res, String token) throws Exception {
    if (tokenService.isTokenNearExpiration(token)) {
      synchronized (refreshLock) {
        if (isRefreshing) {
          while (isRefreshing) {
            refreshLock.wait(100);
          }
          return latestToken != null ? latestToken : token;
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
          System.out.println("만료 임박 액세스 토큰 갱신: " + newToken);

          latestToken = newToken;
          return newToken;
        }
      } finally {
        synchronized (refreshLock) {
          isRefreshing = false;
          latestToken = null; // 사용 후 초기화
          refreshLock.notifyAll();
        }
      }
    }
    return token;
  }

  private void setAuthentication(HttpServletRequest req, String token) {
    String adminId = tokenService.extractEmail(token);
    List<String> roles = tokenService.extractRoles(token);

    List<GrantedAuthority> authorities = roles.stream()
        .map(SimpleGrantedAuthority::new)
        .collect(Collectors.toList());

    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
        adminId, null, authorities);
    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
    SecurityContextHolder.getContext().setAuthentication(authentication);
  }

  private String handleExpiredAccessToken(HttpServletRequest req, HttpServletResponse res) throws IOException {
    synchronized (refreshLock) {
      if (isRefreshing) {
        try {
          while (isRefreshing) {
            refreshLock.wait(100);
          }
          return latestToken != null ? latestToken : null;
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          sendErrorResponse(res, ErrorCode.INTERNAL_SERVER_ERROR);
          return null;
        }
      }
      isRefreshing = true;
    }

    try {
      String refreshToken = getRefreshTokenFromCookie(req);
      if (refreshToken != null && tokenService.validateRefreshToken(refreshToken)) {
        String newAccessToken = adminService.refreshAccessToken(refreshToken);
        res.setHeader("Authorization", "Bearer " + newAccessToken);
        res.setHeader("Token-Refreshed", "true");
        System.out.println("만료 후 액세스 토큰 갱신: " + newAccessToken);
        latestToken = newAccessToken;
        return newAccessToken;
      } else {
        sendErrorResponse(res, ErrorCode.REFRESH_TOKEN_EXPIRED);
        return null;
      }
    } finally {
      synchronized (refreshLock) {
        isRefreshing = false;
        latestToken = null;
        refreshLock.notifyAll();
      }
    }
  }

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

  private void sendErrorResponse(HttpServletResponse res, ErrorCode errorCode) throws IOException {
    res.setStatus(errorCode.getHttpStatus().value());
    res.setCharacterEncoding("UTF-8");
    res.getWriter().write(String.format(
        "{\"error\":\"%s\",\"code\":\"%s\",\"message\":\"%s\",\"status\":%d}",
        errorCode.name(), errorCode.getCode(), errorCode.getMsg(), errorCode.getHttpStatus().value()));
  }
}
