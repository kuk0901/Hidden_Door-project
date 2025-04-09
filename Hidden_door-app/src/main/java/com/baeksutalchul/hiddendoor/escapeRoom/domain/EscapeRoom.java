package com.baeksutalchul.hiddendoor.escapeRoom.domain;

import java.time.LocalTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
  private String openTime;
  private String closeTime;

}