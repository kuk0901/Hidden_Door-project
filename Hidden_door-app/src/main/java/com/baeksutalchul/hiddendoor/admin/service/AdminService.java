package com.baeksutalchul.hiddendoor.admin.service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baeksutalchul.hiddendoor.admin.domain.Admin;
import com.baeksutalchul.hiddendoor.admin.repository.AdminRepository;
import com.baeksutalchul.hiddendoor.dto.AdminDeleteRequestDto;
import com.baeksutalchul.hiddendoor.dto.AdminDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.token.TokenService;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;
import com.baeksutalchul.hiddendoor.utils.page.PageableUtil;

import io.jsonwebtoken.Claims;
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

  public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder,
      TokenService tokenService, ModelMapper modelMapper) {
    this.adminRepository = adminRepository;
    this.passwordEncoder = passwordEncoder;
    this.tokenService = tokenService;
    this.modelMapper = modelMapper;

    this.modelMapper.typeMap(Admin.class, AdminDto.class).addMappings(mapper -> {
      mapper.skip(AdminDto::setPwd);
      mapper.skip(AdminDto::setToken);
    });
  }

  // 계정 생성
  public ResponseDto<AdminDto> registerUser(AdminDto adminDto) {
    // 중복 사용자 email 체크
    if (adminRepository.existsByEmail(adminDto.getEmail())) {
      throw new CustomException(ErrorCode.ADMIN_DUPLICATE_EMAIL);
    }

    // 중복 사용자 phone 체크
    if (adminRepository.existsByPhone(adminDto.getPhone())) {
      throw new CustomException(ErrorCode.ADMIN_DUPLICATE_PHONE);
    }

    // 비밀번호 인코딩
    String encodedPassword = passwordEncoder.encode(adminDto.getPwd());

    Admin admin = new Admin();
    admin.setUserName(adminDto.getUserName());
    admin.setPhone(adminDto.getPhone());
    admin.setEmail(adminDto.getEmail());
    admin.setPwd(encodedPassword);

    if (adminDto.getRoles() == null) {
      admin.setRoles(List.of("ROLE_ADMIN", "ROLE_USER"));
    } else {
      admin.setRoles(adminDto.getRoles());
    }

    admin.setRolesCount(admin.getRoles().size());

    Admin adminRes = adminRepository.save(admin);
    AdminDto adminDtoRes = modelMapper.map(adminRes, AdminDto.class);

    return new ResponseDto<>(adminDtoRes, "success");
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
        adminDto.setAdminId(admin.getAdminId());
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
  public String refreshAccessToken(String refreshToken, HttpServletResponse response) {

    if (!tokenService.validateRefreshToken(refreshToken)) {
      throw new CustomException(ErrorCode.REFRESH_TOKEN_EXPIRED);
    }

    Claims claims = tokenService.extractAllClaims(refreshToken);
    Date expirationDate = claims.getExpiration();
    long remainingTime = expirationDate.getTime() - System.currentTimeMillis();
    long days = TimeUnit.MILLISECONDS.toDays(remainingTime);

    String email = tokenService.extractEmail(refreshToken);
    Optional<Admin> adminOptional = adminRepository.findByEmail(email);
    if (adminOptional.isPresent()) {
      Admin admin = adminOptional.get();

      // 남은 만료 시간이 70일 이하인 경우 리프레시 토큰 갱신
      if (days <= 70) {
        String newRefreshToken = tokenService.generateRefreshToken(admin.getEmail());

        Cookie cookie = new Cookie("refreshToken", newRefreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 개발 단계에서는 false, HTTPS에서는 true
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 100);
        response.addCookie(cookie);
      }

      return tokenService.generateToken(admin.getEmail(), admin.getRoles());
    } else {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }
  }

  public AdminDto getUserInfoByToken(String token) {
    try {
      String email = tokenService.extractEmail(token);

      boolean isValid = tokenService.validateToken(token, email);

      if (!isValid) {
        throw new CustomException(ErrorCode.ACCESS_TOKEN_EXPIRED);
      }

      Optional<Admin> adminOptional = adminRepository.findByEmail(email);
      if (adminOptional.isPresent()) {
        Admin admin = adminOptional.get();
        AdminDto adminDto = new AdminDto();
        adminDto.setAdminId(admin.getAdminId());
        adminDto.setEmail(admin.getEmail());
        adminDto.setUserName(admin.getUserName());
        adminDto.setRoles(admin.getRoles());
        return adminDto;
      } else {
        throw new CustomException(ErrorCode.USER_NOT_FOUND);
      }
    } catch (CustomException e) {
      throw new CustomException(ErrorCode.INVALID_TOKEN);
    } catch (Exception e) {
      e.printStackTrace();
      throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  public ResponseDto<List<AdminDto>> getAllAdmin(PageDto pageDto, String searchField, String searchTerm) {
    Pageable pageable = PageableUtil.createPageRequest(
        Math.max(0, pageDto.getPage() - 1),
        pageDto.getSize(),
        "rolesCount",
        "ASC");

    Page<Admin> adminPage;

    if (searchTerm != null && !searchTerm.trim().isEmpty()) {
      switch (searchField) {
        case "email":
          adminPage = adminRepository.findByEmailContainingOrderByRolesCountDesc(searchTerm, pageable);
          break;
        case "userName":
          adminPage = adminRepository.findByUserNameContainingOrderByRolesCountDesc(searchTerm, pageable);
          break;
        case "roles":
          adminPage = adminRepository.findByRolesContainingOrderByRolesCountDesc(searchTerm, pageable);
          break;
        default:
          adminPage = adminRepository.findAllByOrderByRolesCountDesc(pageable);
      }
    } else {
      adminPage = adminRepository.findAllByOrderByRolesCountDesc(pageable);
    }

    List<AdminDto> adminDtoList = adminPage.getContent().stream()
        .map(admin -> modelMapper.map(admin, AdminDto.class))
        .toList();

    PageDto resultPageDto = PageableUtil.createPageDto(adminPage);

    // TODO: 데이터가 없을 경우 처리 필요
    String message = adminDtoList.isEmpty() ? "관리자 정보가 없습니다." : "success";

    return new ResponseDto<>(adminDtoList, message, resultPageDto, searchField, searchTerm);
  }

  public ResponseDto<AdminDto> getAdminInfo(String adminId) {
    Admin admin = adminRepository.findById(adminId).orElseThrow(() -> new CustomException(ErrorCode.ADMIN_NOT_FOUND));

    AdminDto adminDto = modelMapper.map(admin, AdminDto.class);

    return new ResponseDto<>(adminDto, "success");
  }

  @Transactional
  public ResponseDto<List<AdminDto>> deleteAdminOne(AdminDeleteRequestDto requestDto) {
    Admin admin = adminRepository.findById(requestDto.getId())
        .orElseThrow(() -> new CustomException(ErrorCode.ADMIN_NOT_FOUND));

    adminRepository.delete(admin);

    PageDto pageDto = new PageDto(
        requestDto.getPage(),
        requestDto.getSize(),
        0L,
        0,
        requestDto.getPage() == 1,
        false,
        requestDto.getSortField(),
        requestDto.getSortDirection());

    ResponseDto<List<AdminDto>> responseDto = getAllAdmin(pageDto, requestDto.getSearchField(),
        requestDto.getSearchTerm());
    responseDto.setMsg(admin.getUserName() + "님의 계정이 삭제되었습니다.");

    return responseDto;
  }

  @Transactional
  public ResponseDto<AdminDto> updateAdminOne(AdminDto adminDto) {
    Admin admin = adminRepository.findById(adminDto.getAdminId())
        .orElseThrow(() -> new CustomException(ErrorCode.ADMIN_NOT_FOUND));

    // email 중복 검사, 단 본인 email 제외
    if (!admin.getEmail().equals(adminDto.getEmail()) && adminRepository.existsByEmail(adminDto.getEmail())) {
      throw new CustomException(ErrorCode.ADMIN_DUPLICATE_EMAIL);
    }

    // phone 중복 검사, 단 본인 phone 제외
    if (!admin.getPhone().equals(adminDto.getPhone()) && adminRepository.existsByPhone(adminDto.getPhone())) {
      throw new CustomException(ErrorCode.ADMIN_DUPLICATE_PHONE);
    }

    // 변경사항이 없는 경우 에러 반환
    if (!applyChanges(admin, adminDto)) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    // 변경사항이 있는 경우 저장
    Admin updatedAdmin = adminRepository.save(admin);
    AdminDto updatedAdminDto = modelMapper.map(updatedAdmin, AdminDto.class);

    return new ResponseDto<>(updatedAdminDto, updatedAdminDto.getUserName() + "님의 정보가 수정되었습니다.");
  }

  private boolean applyChanges(Admin admin, AdminDto dto) {
    boolean hasChanges = false;

    if (!Objects.equals(admin.getUserName(), dto.getUserName())) {
      admin.setUserName(dto.getUserName());
      hasChanges = true;
    }

    if (!Objects.equals(admin.getEmail(), dto.getEmail())) {
      admin.setEmail(dto.getEmail());
      hasChanges = true;
    }

    if (!Objects.equals(admin.getPhone(), dto.getPhone())) {
      admin.setPhone(dto.getPhone());
      hasChanges = true;
    }

    if (dto.getPwd() != null && !passwordEncoder.matches(dto.getPwd(), admin.getPwd())) {
      admin.setPwd(passwordEncoder.encode(dto.getPwd()));
      hasChanges = true;
    }

    if (!Objects.equals(admin.getRoles(), dto.getRoles())) {
      admin.setRoles(dto.getRoles());
      admin.setRolesCount(dto.getRoles().size());
      hasChanges = true;
    }

    return hasChanges;
  }

}
