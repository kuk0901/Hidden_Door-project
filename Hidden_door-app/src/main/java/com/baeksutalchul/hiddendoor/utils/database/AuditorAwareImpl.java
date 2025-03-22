package com.baeksutalchul.hiddendoor.utils.database;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 데이터베이스 감사(Auditing) 정보를 제공하는 클래스
 * Spring Data MongoDB의 AuditorAware 인터페이스를 구현하여 현재 사용자 정보를 제공
 * => MongoDB 문서의 생성자 및 수정자 필드를 자동으로 채우는 데 사용
 */
public class AuditorAwareImpl implements AuditorAware<String> {

  /**
   * MongoDB 문서의 감사 필드(예: createdBy, lastModifiedBy)에 사용
   * 
   * @return 현재 인증된 사용자의 이름. 인증되지 않은 경우 "system"을 반환
   * 
   */
  @Override
  public Optional<String> getCurrentAuditor() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()) {
      return Optional.of("system"); // 인증되지 않은 경우 기본값으로 설정
    }

    return Optional.ofNullable(authentication.getName());
  }
}
