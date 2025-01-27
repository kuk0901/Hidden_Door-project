package com.baeksutalchul.hiddendoor.escapeRoom.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.http.ResponseEntity;

import com.baeksutalchul.hiddendoor.dto.EscapeRoomDto;
import com.baeksutalchul.hiddendoor.escapeRoom.service.EscapeRoomService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

@RestController
@RequestMapping("/api/v1/escape-rooms")
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

  @PatchMapping("/info/title")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomTitle(@RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomTitle(escapeRoomDto));
  }

  @PatchMapping("/info/explanation")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomExplanation(
      @RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomExplanation(escapeRoomDto));
  }

  @PatchMapping("/info/theme-title-line")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomThemeTitleLine(
      @RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomThemeTitleLine(escapeRoomDto));
  }

  @PatchMapping("/info/theme-explanation-line")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomThemeExplanationLine(
      @RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomThemeExplanationLine(escapeRoomDto));
  }

}
