package com.baeksutalchul.hiddendoor.notice.domain;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notice")
public class Notice {
    @Id
    private String id;
    private String title;
    private String content;

    @CreatedDate
    private Instant createdAt;
}
