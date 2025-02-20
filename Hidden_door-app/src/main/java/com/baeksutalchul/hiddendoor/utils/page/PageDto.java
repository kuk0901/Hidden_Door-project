package com.baeksutalchul.hiddendoor.utils.page;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PageDto {
  private int page; // 현재 페이지 번호 (1-based)
  private int size; // 페이지 크기 (항목 수)
  private long totalElements; // 전체 항목 수
  private int totalPages; // 전체 페이지 수
  private boolean isFirst; // 첫 번째 페이지 여부
  private boolean isLast; // 마지막 페이지 여부
  private String sortField; // 정렬 필드
  private String sortDirection; // 정렬 방향

  // 기본 생성자 (기본값 설정)
  public PageDto() {
    this.page = 1;
    this.size = PageableUtil.DEFAULT_SIZE;
    this.totalElements = 0;
    this.totalPages = 0;
    this.isFirst = true;
    this.isLast = true;
    this.sortField = PageableUtil.DEFAULT_SORT_FIELD;
    this.sortDirection = PageableUtil.DEFAULT_SORT_DIRECTION;
  }
}
