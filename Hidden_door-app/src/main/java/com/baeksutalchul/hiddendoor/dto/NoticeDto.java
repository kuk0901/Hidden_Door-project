package com.baeksutalchul.hiddendoor.dto;

import java.time.Instant;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDto {
    private String id;
    private String title;
    private String content;
    private Instant createdAt;
    private String kstCreatedAt;
}
