package com.baeksutalchul.hiddendoor.admin.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.admin.domain.Admin;
import com.baeksutalchul.hiddendoor.admin.repository.AdminRepository;
import com.baeksutalchul.hiddendoor.dto.AdminDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.token.TokenService;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;
import com.baeksutalchul.hiddendoor.utils.page.PageableUtil;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class AdminService {
  private final AdminRepository adminRepository;
  private final PasswordEncoder passwordEncoder;
  private final TokenService tokenService;
  private final ModelMapper modelMapper;

  private final Logger logger = LoggerFactory.getLogger(AdminService.class);

  public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder,
      TokenService tokenService, ModelMapper modelMapper) {
    this.adminRepository = adminRepository;
    this.passwordEncoder = passwordEncoder;
    this.tokenService = tokenService;
    this.modelMapper = modelMapper;
  }

  // 계정 생성
  public void registerUser(AdminDto adminDto) {
    // 비밀번호 인코딩
    String encodedPassword = passwordEncoder.encode(adminDto.getPwd());

    Admin admin = new Admin();
    admin.setEmail(adminDto.getEmail());
    admin.setPwd(encodedPassword);
    admin.setUserName(adminDto.getUserName());
    admin.setRoles(List.of("ROLE_ADMIN", "ROLE_USER"));

    // 중복 사용자 ID 체크
    if (adminRepository.existsById(admin.getEmail())) {
      throw new CustomException(ErrorCode.ADMIN_ALREADY_EXISTS);
    }

    // 사용자 정보를 데이터베이스에 저장
    try {
      adminRepository.save(admin);
    } catch (Exception e) {
      throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  public ResponseDto<AdminDto> login(String email, String pwd, HttpServletResponse response) {
    Optional<Admin> adminOptional = adminRepository.findByEmail(email);

    if (adminOptional.isPresent()) {
      Admin admin = adminOptional.get();
      if (passwordEncoder.matches(pwd, admin.getPwd())) {
        String accessToken = tokenService.generateToken(admin.getEmail(), admin.getRoles()); // 액세스 토큰 생성
        String refreshToken = tokenService.generateRefreshToken(admin.getEmail()); // 리프레시 토큰 생성

        // 쿠키에 리프레시 토큰 저장
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true); // JavaScript에서 접근 불가
        cookie.setSecure(false); // 개발 단계에서는 false로 설정 (HTTPS 사용 시 true로 변경)
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 100); // 100일 유효

        response.addCookie(cookie); // 응답에 쿠키 추가

        // 사용자 정보를 DTO로 변환
        AdminDto adminDto = new AdminDto();
        adminDto.setEmail(admin.getEmail());
        adminDto.setUserName(admin.getUserName());
        adminDto.setRoles(admin.getRoles());

        // ResponseDto 생성
        return new ResponseDto<>(accessToken, adminDto, "로그인되었습니다.");
      } else {
        throw new CustomException(ErrorCode.INVALID_PASSWORD);
      }
    } else {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }
  }

  // 리프레시 토큰을 이용해 액세스 토큰 생성
  public String refreshAccessToken(String refreshToken) {
    if (!tokenService.validateRefreshToken(refreshToken)) {
      throw new CustomException(ErrorCode.REFRESH_TOKEN_EXPIRED);
    }

    String email = tokenService.extractEmail(refreshToken);
    Optional<Admin> adminOptional = adminRepository.findByEmail(email);
    if (adminOptional.isPresent()) {
      Admin admin = adminOptional.get();
      return tokenService.generateToken(admin.getEmail(), admin.getRoles());
    } else {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }
  }

  public AdminDto getUserInfoByToken(String token) {
    // 사용자 ID 추출
    String email = tokenService.extractEmail(token);

    // JWT 검증
    if (!tokenService.validateToken(token, email)) {
      throw new CustomException(ErrorCode.ACCESS_TOKEN_EXPIRED);
    }

    // 데이터베이스에서 사용자 정보 조회
    Optional<Admin> adminOptional = adminRepository.findByEmail(email);
    if (adminOptional.isPresent()) {
      Admin admin = adminOptional.get();
      AdminDto adminDto = new AdminDto();
      adminDto.setEmail(admin.getEmail());
      adminDto.setUserName(admin.getUserName());
      adminDto.setRoles(admin.getRoles());

      return adminDto; // 사용자 정보 반환
    } else {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }
  }

  public ResponseDto<List<AdminDto>> getAllAdmin(PageDto pageDto, String searchField, String searchTerm) {
    Pageable pageable = PageableUtil.createPageRequest(
        Math.max(0, pageDto.getPage() - 1),
        pageDto.getSize(),
        pageDto.getSortField(),
        pageDto.getSortDirection());

    Page<Admin> adminPage;

    // FIXME: searchField == all 일 때 searchTerm으로 검색이 동작하는 이유
    if (searchTerm != null && !searchTerm.trim().isEmpty()) {
      switch (searchField) {
        case "all":
          adminPage = adminRepository.findAll(pageable);
          break;
        case "email":
          adminPage = adminRepository.findByEmailContaining(searchTerm, pageable);
          break;
        case "userName":
          adminPage = adminRepository.findByUserNameContaining(searchTerm, pageable);
          break;
        case "roles":
          adminPage = adminRepository.findByRolesContaining(searchTerm, pageable);
          break;
        default:
          adminPage = adminRepository.findByEmailContainingOrUserNameContaining(searchTerm, searchTerm, pageable);
      }
    } else {
      adminPage = adminRepository.findAll(pageable);
    }

    if (adminPage.isEmpty()) {
      throw new CustomException(ErrorCode.ADMIN_NOT_FOUND);
    }

    List<AdminDto> adminDtoList = adminPage.getContent().stream()
        .map(admin -> modelMapper.map(admin, AdminDto.class))
        .toList();

    PageDto resultPageDto = PageableUtil.createPageDto(adminPage);
    logger.info("resultPageDto: {}", resultPageDto);

    return new ResponseDto<>(adminDtoList, "success", resultPageDto, searchTerm);
  }

}
