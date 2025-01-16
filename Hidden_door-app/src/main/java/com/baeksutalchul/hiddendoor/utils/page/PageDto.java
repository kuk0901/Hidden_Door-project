package com.baeksutalchul.hiddendoor.utils.page;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PageDto {
  private int page = 1;
  private int size = 10;
  private String sortField;
  private boolean isAsc;
}
