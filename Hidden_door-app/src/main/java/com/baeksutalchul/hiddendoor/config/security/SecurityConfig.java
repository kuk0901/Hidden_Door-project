package com.baeksutalchul.hiddendoor.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.Customizer;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.baeksutalchul.hiddendoor.admin.repository.AdminRepository;
import com.baeksutalchul.hiddendoor.admin.service.AdminService;
import com.baeksutalchul.hiddendoor.security.CustomAccessDeniedHandler;
import com.baeksutalchul.hiddendoor.security.CustomAuthenticationEntryPoint;
import com.baeksutalchul.hiddendoor.token.TokenAuthenticationFilter;
import com.baeksutalchul.hiddendoor.token.TokenService;

import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final TokenService tokenService;
  private final AdminRepository adminRepository;
  private final AdminService adminService;
  private final CorsConfigurationSource corsConfigurationSource;

  public SecurityConfig(TokenService tokenService, AdminRepository adminRepository,
      @Lazy AdminService adminService, CorsConfigurationSource corsConfigurationSource) {
    this.tokenService = tokenService;
    this.adminRepository = adminRepository;
    this.adminService = adminService;
    this.corsConfigurationSource = corsConfigurationSource;

  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource))
        .csrf(csrf -> csrf.disable())
        .addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.GET, "/api/v1/**").permitAll()
            .requestMatchers("/images/**", "/api/v1/auth/authenticate", "/api/v1/customers/customer/add",
                "/api/v1/customers/customer/delete/*", "/api/v1/reservations/create")
            .permitAll()
            .requestMatchers("/api/v1/admins/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_SUPER_ADMIN")
            .requestMatchers("/api/v1/auth/register", "/api/v1/admins/account/delete/one", "/api/v1/super-admin/**")
            .hasAuthority("ROLE_SUPER_ADMIN")
            .anyRequest().authenticated())
        .exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint(customAuthenticationEntryPoint())
            .accessDeniedHandler(customAccessDeniedHandler()))
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    return http.build();
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
