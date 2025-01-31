package com.baeksutalchul.hiddendoor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EscapeRoomDto {
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
