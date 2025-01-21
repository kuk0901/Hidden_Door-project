package com.baeksutalchul.hiddendoor.escapeRoom.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.dto.EscapeRoomDto;
import com.baeksutalchul.hiddendoor.escapeRoom.service.EscapeRoomService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/escape-room")
public class EscapeRoomController {
  private EscapeRoomService escapeRoomService;

  private static final Logger logger = LoggerFactory.getLogger(EscapeRoomController.class);

  public EscapeRoomController(EscapeRoomService escapeRoomService) {
    this.escapeRoomService = escapeRoomService;
  }

  @GetMapping("/info")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> getEscapeRoomInfo() {
    return ResponseEntity.ok().body(escapeRoomService.getEscapeRoomInfo());
  }

  @PutMapping("/info")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomInfo(@RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomInfo(escapeRoomDto));
  }

}
