package com.baeksutalchul.hiddendoor.utils.page;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PageableUtil {
  // 기본 페이지 번호 (1)
  private static final int DEFAULT_PAGE = 1;
  // 기본 페이지 크기 (10)
  private static final int DEFAULT_SIZE = 10;
  // 기본 정렬 필드
  private static final String DEFAULT_SORT_FIELD = "id";
  // 기본 정렬 방향 (오름차순)
  private static final boolean DEFAULT_IS_ASC = true;

  // 인스턴스 방지
  private PageableUtil() {
    throw new AssertionError("Cannot instantiate utility class");
  }

  /**
   * 페이지 요청을 생성하는 메서드
   *
   * @param page      요청할 페이지 번호
   * @param size      페이지당 데이터 수
   * @param sortField 정렬할 필드 이름
   * @param isAsc     오름차순 여부
   * @return Pageable 객체
   */
  public static Pageable createPageRequest(int page, int size, String sortField, boolean isAsc) {
    Sort.Direction direction = isAsc ? Sort.Direction.ASC : Sort.Direction.DESC;
    Sort sort = Sort.by(direction, sortField);
    return PageRequest.of(page, size, sort);
  }

  /**
   * 기본값을 사용하여 페이지 요청을 생성하는 메서드
   *
   * @return Pageable 객체
   */
  public static Pageable createDefaultPageRequest() {
    return createPageRequest(DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_SORT_FIELD, DEFAULT_IS_ASC);
  }

  /**
   * 기본 페이지 크기를 사용하여 페이지 요청을 생성하는 메서드
   *
   * @param page      요청할 페이지 번호
   * @param sortField 정렬할 필드 이름
   * @param isAsc     오름차순 여부
   * @return Pageable 객체
   */
  public static Pageable createPageRequestWithDefaultSize(int page, String sortField, boolean isAsc) {
    return createPageRequest(page, DEFAULT_SIZE, sortField, isAsc);
  }
}
