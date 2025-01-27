package com.baeksutalchul.hiddendoor.theme.domain;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// FIXME: 각 인스턴스 변수 값 documents/database 문서에 맞춰 수정 -> ThemeDto 생성
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "theme")
public class Theme {
  @Id
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
