package com.baeksutalchul.hiddendoor.utils.sort;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import com.baeksutalchul.hiddendoor.dto.AdminDto;

/**
 * 관리자 정렬 유틸리티 클래스
 * 관리자 목록을 역할(Role)에 따라 정렬하는 기능을 제공
 */
public class AdminSortUtil {
  private static final Map<String, Integer> ROLE_WEIGHTS = Map.of(
      "ROLE_SUPER_ADMIN", 4,
      "ROLE_DIRECTOR", 3,
      "ROLE_ADMIN", 2,
      "ROLE_USER", 1);

  private AdminSortUtil() {
  }

  /**
   * 관리자 목록을 역할에 따라 정렬
   * 높은 권한을 가진 관리자가 리스트의 앞쪽에 위치
   *
   * @param adminDtoList 정렬할 관리자 DTO 리스트
   * @return 역할에 따라 정렬된 관리자 DTO 리스트
   */
  public static List<AdminDto> sortByRoles(List<AdminDto> adminDtoList) {
    return adminDtoList.stream()
        .sorted(Comparator.comparingInt(AdminSortUtil::calculateRoleWeight).reversed()).toList();

  }

  /**
   * 관리자의 역할 가중치를 계산
   * 관리자가 여러 역할을 가진 경우, 각 역할의 가중치 합계를 반환
   *
   * @param adminDto 가중치를 계산할 관리자 DTO
   * @return 계산된 역할 가중치
   */
  private static int calculateRoleWeight(AdminDto adminDto) {
    return adminDto.getRoles().stream()
        .mapToInt(role -> ROLE_WEIGHTS.getOrDefault(role, 0))
        .sum();
  }
}
