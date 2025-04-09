package com.baeksutalchul.hiddendoor.timeSlot.domain;

import java.time.LocalDate;
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
    private String id; // "theme1_20240408"
    private String themeId;
    private LocalDate date;
    private List<TimeSlotDetail> slots; // 변경점: 객체 리스트로 관리

    // 내부 클래스로 시간대 상세 정보 관리
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TimeSlotDetail {
        private String time; // "HH:mm" 형식
        private boolean isBooked;
        private String reservationNumber; // null 가능
    }
}
