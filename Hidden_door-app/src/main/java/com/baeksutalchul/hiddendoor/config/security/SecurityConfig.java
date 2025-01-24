package com.baeksutalchul.hiddendoor.config.security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.baeksutalchul.hiddendoor.admin.repository.AdminRepository;
import com.baeksutalchul.hiddendoor.admin.service.AdminService;
import com.baeksutalchul.hiddendoor.security.CustomAccessDeniedHandler;
import com.baeksutalchul.hiddendoor.security.CustomAuthenticationEntryPoint;
import com.baeksutalchul.hiddendoor.token.TokenAuthenticationFilter;
import com.baeksutalchul.hiddendoor.token.TokenService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final TokenService tokenService;
  private final AdminRepository adminRepository;
  private final AdminService adminService;

  public SecurityConfig(TokenService tokenService, AdminRepository adminRepository,
      @Lazy AdminService adminService) {
    this.tokenService = tokenService;
    this.adminRepository = adminRepository;
    this.adminService = adminService;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/authenticate", "/api/v1/auth/register",
                "/api/v1/auth/terminate", "/images/**")
            .permitAll()
            .requestMatchers(HttpMethod.GET, "/api/v1/escape-rooms/**", "/api/v1/cautions/**", "/api/v1/themes/**")
            .permitAll()
            .requestMatchers(HttpMethod.POST, "/api/v1/escape-rooms/**", "/api/v1/cautions/**", "/api/v1/themes/**")
            .authenticated()
            .requestMatchers(HttpMethod.PATCH, "/api/v1/escape-rooms/**", "/api/v1/cautions/**", "/api/v1/themes/**")
            .authenticated()
            .requestMatchers(HttpMethod.PUT, "/api/v1/escape-rooms/**", "/api/v1/cautions/**", "/api/v1/themes/**")
            .authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/v1/escape-rooms/**", "/api/v1/cautions/**", "/api/v1/themes/**")
            .authenticated()
            .requestMatchers("/api/v1/auth/renew", "/api/v1/auth/verify").authenticated()
            .requestMatchers("/api/v1/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")
            .requestMatchers("/api/v1/super-admin/**").hasAuthority("ROLE_SUPER_ADMIN")
            .anyRequest().authenticated())
        .exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint(customAuthenticationEntryPoint())
            .accessDeniedHandler(customAccessDeniedHandler()));

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // 프론트엔드 주소
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public TokenAuthenticationFilter tokenAuthenticationFilter() {
    return new TokenAuthenticationFilter(tokenService, adminRepository, adminService);
  }

  @Bean
  public CustomAuthenticationEntryPoint customAuthenticationEntryPoint() {
    return new CustomAuthenticationEntryPoint();
  }

  @Bean
  public CustomAccessDeniedHandler customAccessDeniedHandler() {
    return new CustomAccessDeniedHandler();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
