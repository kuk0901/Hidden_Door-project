package com.baeksutalchul.hiddendoor.monitoring.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.dto.DashboardDto;
import com.baeksutalchul.hiddendoor.monitoring.service.MonitoringService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/monitoring")
public class MonitoringController {
  private final MonitoringService monitoringService;

  public MonitoringController(MonitoringService monitoringService) {
    this.monitoringService = monitoringService;
  }

  @GetMapping("/dashboard")
  public ResponseEntity<ResponseDto<DashboardDto>> getDashboardData() {
    return ResponseEntity.ok().body(monitoringService.getDashboardData());
  }

}
