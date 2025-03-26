package com.baeksutalchul.hiddendoor.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private String eventId;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String isOngoing;
    private String noEndDate;
    private String eventType; // "상시", "종료일 미정", "기간 지정" 중 하나
}
