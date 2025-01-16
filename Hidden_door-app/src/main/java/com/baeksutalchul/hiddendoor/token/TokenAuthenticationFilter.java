package com.baeksutalchul.hiddendoor.token;

import io.jsonwebtoken.ExpiredJwtException;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.baeksutalchul.hiddendoor.admin.repository.AdminRepository;
import com.baeksutalchul.hiddendoor.admin.service.AdminService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {
  private final TokenService tokenService;
  private final AdminRepository adminRepository;
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

    // 리프레시 토큰 요청일 경우 쿠키에서 리프레시 토큰 가져오기
    if (req.getRequestURI().equals("/api/v1/auth/renew")) {
      String refreshToken = null;
      Cookie[] cookies = req.getCookies();

      if (cookies != null) {
        for (Cookie cookie : cookies) {
          if (cookie.getName().equals("refreshToken")) {
            refreshToken = cookie.getValue();
            break;
          }
        }
      }

      // 리프레시 토큰이 존재하고 유효한지 검증
      if (refreshToken != null && tokenService.validateRefreshToken(refreshToken)) {

        // 새로운 액세스 토큰 생성
        String newAccessToken = adminService.refreshAccessToken(refreshToken); // 리프레시 토큰으로 액세스 토큰 갱신

        // ResponseDto 형태로 응답 설정
        res.setContentType("application/json");
        res.setStatus(HttpServletResponse.SC_OK);
        ResponseDto<String> responseDto = new ResponseDto<>(newAccessToken);
        res.getWriter().write(new ObjectMapper().writeValueAsString(responseDto));
        res.getWriter().flush();

        return; // 필터 체인 종료
      } else {

        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.getWriter().write("Invalid refresh token");
        res.getWriter().flush();
        return; // 필터 체인 종료
      }
    } else if (token != null && token.startsWith("Bearer ")) {
      // 액세스 토큰 처리 로직
      token = token.substring(7);
      try {
        String adminId = tokenService.extractEmail(token);

        if (adminId != null && SecurityContextHolder.getContext().getAuthentication() == null
            && tokenService.validateToken(token, adminId)) {
          List<GrantedAuthority> authorities = adminRepository.findByAdminId(adminId)
              .map(user -> user.getRoles().stream()
                  .map(role -> (GrantedAuthority) () -> role)
                  .toList())
              .orElse(List.of());

          SecurityContextHolder.getContext().setAuthentication(
              new UsernamePasswordAuthenticationToken(adminId, null, authorities));
        }

      } catch (ExpiredJwtException e) { // 유효기간 만료 에러
        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.getWriter().write("Token has expired");
        res.getWriter().flush();

        return; // 필터 체인을 종료
      } catch (Exception e) { // 전체 에러
        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.getWriter().write("Unauthorized");
        res.getWriter().flush();

        return; // 필터 체인을 종료
      }
    }

    filterChain.doFilter(req, res); // 필터 체인 계속 진행
  }
}
