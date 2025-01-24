package com.baeksutalchul.hiddendoor.escapeRoom.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// FIXME: 테마, 테마 상세 페이지에서 사용할 타이틀도 추가해야 함
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "escapeRoom")
public class EscapeRoom {
  @Id
  private String roomId;
  private String roomName;
  private String location;
  private String title;
  private String explanation;
  private String contactInfo;
  private String storedFileName;
  private String originalFileName;
  private String themeHeaderTitle;
  private String themeHeaderSubtitle;
  private String themeTitle;
  private String themeExplanation;
  private String themeDetailHeaderTitle;
  private String themeDetailHeaderSubtitle;
}