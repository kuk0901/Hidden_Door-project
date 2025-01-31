package com.baeksutalchul.hiddendoor.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThemeDto {
  private String themeId;
  private String themeName;
  private List<String> genre;
  private int minParticipants;
  private int maxParticipants;
  private Float level;
  private int time;
  private String description;
  private String storedFileName;
  private String originalFileName;
  private int reservationCount;
  private int price;
  private long totalUsage;
}
