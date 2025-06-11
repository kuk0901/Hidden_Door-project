package com.baeksutalchul.hiddendoor.timeSlot.domain;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "timeSlot")
@CompoundIndex(def = "{'themeId': 1, 'date': 1}", name = "timeslot_search_idx")
@CompoundIndex(def = "{'slots.time': 1, 'slots.isBooked': 1}", name = "slot_availability_idx")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlot {
    @Id
    private String id;
    private String themeId;
    private String date;
    private List<TimeSlotDetail> slots;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TimeSlotDetail {
        private String time;
        private boolean isBooked;
        private String reservationNumber;
    }
}
