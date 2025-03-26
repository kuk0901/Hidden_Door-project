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

  public TokenAuthenticationFilter(TokenService tokenService, AdminRepository adminRepository,
      AdminService adminService) {
    this.tokenService = tokenService;
    this.adminRepository = adminRepository;
    this.adminService = adminService;

  }

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain)
      throws ServletException, IOException {
    String token = req.getHeader("Authorization");

    if (token != null && token.startsWith("Bearer ")) {
      token = token.substring(7);
      try {
        token = checkAndRefreshToken(req, res, token);
        if (requiresAuthentication(req)) {
          handleAccessToken(req, res, filterChain, token);
        } else {
          filterChain.doFilter(req, res);
        }
      } catch (ExpiredJwtException e) {
        handleExpiredAccessToken(req, res, filterChain);
      } catch (JwtException e) {
        sendErrorResponse(res, ErrorCode.UNAUTHORIZED_ACCESS);
      } catch (Exception e) {
        sendErrorResponse(res, ErrorCode.INTERNAL_SERVER_ERROR);
      }
    } else if (requiresAuthentication(req)) {
      sendErrorResponse(res, ErrorCode.UNAUTHORIZED_ACCESS);
    } else {
      filterChain.doFilter(req, res);
    }
  }

  private String checkAndRefreshToken(HttpServletRequest req, HttpServletResponse res, String token) throws Exception {
    if (tokenService.isTokenNearExpiration(token)) {
      String refreshToken = getRefreshTokenFromCookie(req);
      if (refreshToken != null && tokenService.validateRefreshToken(refreshToken)) {
        String newToken = adminService.refreshAccessToken(refreshToken);
        res.setHeader("New-Access", newToken);
        return newToken;
      }
    }
    return token;
  }

  private boolean requiresAuthentication(HttpServletRequest request) {
    String path = request.getRequestURI();
    return (path.equals("/api/v1/auth/renew") ||
        path.equals("/api/v1/auth/terminate"));
  }

  private void handleAccessToken(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain, String token)
      throws IOException, ServletException {
    String adminId = tokenService.extractEmail(token);

    if (adminId != null && SecurityContextHolder.getContext().getAuthentication() == null
        && tokenService.validateToken(token, adminId)) {
      List<String> roles = tokenService.extractRoles(token);
      if (hasRequiredAuthority(req, roles)) {
        setAuthentication(req, token);
        filterChain.doFilter(req, res);
      } else {
        sendErrorResponse(res, ErrorCode.ACCESS_DENIED);
      }
    } else {
      sendErrorResponse(res, ErrorCode.UNAUTHORIZED_ACCESS);
    }
  }

  private boolean hasRequiredAuthority(HttpServletRequest request, List<String> userRoles) {
    String path = request.getRequestURI();

    if (path.startsWith("/api/v1/admins/")) {
      return userRoles.contains("ROLE_ADMIN") || userRoles.contains("ROLE_SUPER_ADMIN");
    }

    if (path.equals("/api/v1/auth/register") || path.startsWith("/api/v1/admins/account/delete/one") ||
        path.startsWith("/api/v1/super-admin/")) {
      return userRoles.contains("ROLE_SUPER_ADMIN");
    }

    return true;
  }

  private void handleExpiredAccessToken(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain)
      throws IOException, ServletException {
    String refreshToken = getRefreshTokenFromCookie(req);

    if (refreshToken == null || !tokenService.validateRefreshToken(refreshToken)) {
      sendErrorResponse(res, ErrorCode.REFRESH_TOKEN_EXPIRED);
      return;
    }

    String newAccessToken = adminService.refreshAccessToken(refreshToken);
    res.setHeader("New-Access", newAccessToken);

    setAuthentication(req, newAccessToken);
    filterChain.doFilter(req, res);
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

    String jsonResponse = String.format(
        "{\"error\":\"%s\",\"code\":\"%s\",\"message\":\"%s\",\"status\":%d}",
        errorCode.name(),
        errorCode.getCode(),
        errorCode.getMsg(),
        errorCode.getHttpStatus().value());

    res.getWriter().write(jsonResponse);
  }
}
