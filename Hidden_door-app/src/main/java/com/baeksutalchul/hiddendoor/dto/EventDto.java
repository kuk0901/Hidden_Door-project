package com.baeksutalchul.hiddendoor.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private String id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
}
