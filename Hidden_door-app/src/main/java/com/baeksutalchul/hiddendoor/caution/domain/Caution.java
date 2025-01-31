package com.baeksutalchul.hiddendoor.caution.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "caution")
public class Caution {
  @Id
  private String cautionId;
  private String icon;
  private String title;
  private String content;
}
