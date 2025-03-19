package com.baeksutalchul.hiddendoor.utils.sort;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import com.baeksutalchul.hiddendoor.dto.AdminDto;

public class AdminSortUtil {
  private static final Map<String, Integer> ROLE_WEIGHTS = Map.of(
      "ROLE_SUPER_ADMIN", 4,
      "ROLE_DIRECTOR", 3,
      "ROLE_ADMIN", 2,
      "ROLE_USER", 1);

  private AdminSortUtil() {
  }

  public static List<AdminDto> sortByRoles(List<AdminDto> adminDtoList) {
    return adminDtoList.stream()
        .sorted(Comparator.comparingInt(AdminSortUtil::calculateRoleWeight).reversed()).toList();

  }

  private static int calculateRoleWeight(AdminDto adminDto) {
    return adminDto.getRoles().stream()
        .mapToInt(role -> ROLE_WEIGHTS.getOrDefault(role, 0))
        .sum();
  }
}
