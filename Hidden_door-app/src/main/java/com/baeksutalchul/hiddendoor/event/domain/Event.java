package com.baeksutalchul.hiddendoor.event.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "event")
public class Event {
    @Id
    private String id;
    private String title;
    private String description;
}






