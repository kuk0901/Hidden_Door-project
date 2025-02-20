package com.baeksutalchul.hiddendoor.utils.page;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PageableUtil {
  // 기본 페이지 번호 (0-based)
  public static final int DEFAULT_PAGE = 0;
  // 기본 페이지 크기 (10)
  public static final int DEFAULT_SIZE = 10;
  // 기본 정렬 필드
  public static final String DEFAULT_SORT_FIELD = "id";
  // 기본 정렬 방향 (오름차순)
  public static final String DEFAULT_SORT_DIRECTION = "DESC";

  // 인스턴스 방지
  private PageableUtil() {
    throw new AssertionError("Cannot instantiate utility class");
  }

  /**
   * 페이지 요청을 생성하는 메서드
   *
   * @param page          요청할 페이지 번호 (0-based)
   * @param size          페이지당 데이터 수
   * @param sortField     정렬할 필드 이름
   * @param sortDirection 정렬 방향 ("ASC" 또는 "DESC")
   * @return Pageable 객체
   */
  public static Pageable createPageRequest(int page, int size, String sortField, String sortDirection) {
    Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
    Sort sort = Sort.by(direction, sortField != null ? sortField : DEFAULT_SORT_FIELD);
    return PageRequest.of(page, size, sort);
  }

  /**
   * 기본값을 사용하여 페이지 요청을 생성하는 메서드
   *
   * @return Pageable 객체
   */
  public static Pageable createDefaultPageRequest() {
    return createPageRequest(DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION);
  }

  /**
   * Page 객체로부터 PageDto를 생성하는 메서드
   *
   * @param page Page 객체
   * @return PageDto 객체
   */
  public static PageDto createPageDto(Page<?> page) {
    Sort sort = page.getSort();
    String sortField = sort.stream().map(Sort.Order::getProperty).findFirst().orElse(DEFAULT_SORT_FIELD);
    String sortDirection = sort.stream().map(order -> order.getDirection().name()).findFirst()
        .orElse(DEFAULT_SORT_DIRECTION);

    return new PageDto(
        page.getNumber() + 1, // 클라이언트에 전달할 때는 1-based로 변환
        page.getSize(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.isFirst(),
        page.isLast(),
        sortField,
        sortDirection);
  }

}
