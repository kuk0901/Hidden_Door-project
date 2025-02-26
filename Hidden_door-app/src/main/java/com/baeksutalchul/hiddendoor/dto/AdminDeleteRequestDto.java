package com.baeksutalchul.hiddendoor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDeleteRequestDto {
  private String id;
  private int page = 1;
  private int size = 10;
  private String sortField = "id";
  private String sortDirection = "ASC";
  private String searchField;
  private String searchTerm;
}
