package com.baeksutalchul.hiddendoor.monitoring.service;

import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.dto.DashboardDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

@Service
public class MonitoringService {

  public ResponseDto<DashboardDto> getDashboardData() {
    // FIXME: 오늘의 예약수(1일) -> 테마별 예약 수량, 예약, 잔여량
    // themeDayReservations

    // FIXME: 테마별 총 예약 -> 테마별 예약
    // themeTotalReservations

    // FIXME: 일별 테마 예약(임시) -> 7일 기준 -> 테마별 예약
    // dayReservations

    return null;
  }
}
