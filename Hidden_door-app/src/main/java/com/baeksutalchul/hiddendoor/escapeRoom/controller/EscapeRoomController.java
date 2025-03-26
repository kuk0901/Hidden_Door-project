package com.baeksutalchul.hiddendoor.escapeRoom.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

  @PatchMapping("/info/title/{id}")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomTitle(@PathVariable("id") String id,
      @RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomTitle(id, escapeRoomDto));
  }

  // patchVariable 추가 -> 수정 필요
  @PatchMapping("/info/explanation/{id}")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomExplanation(@PathVariable("id") String id,
      @RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomExplanation(id, escapeRoomDto));
  }

  @PatchMapping("/info/theme-title-line/{id}")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomThemeTitleLine(@PathVariable("id") String id,
      @RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomThemeTitleLine(id, escapeRoomDto));
  }

  @PatchMapping("/info/theme-explanation-line/{id}")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomThemeExplanationLine(@PathVariable("id") String id,
      @RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomThemeExplanationLine(id, escapeRoomDto));
  }

  @PatchMapping("/info/update-image/{id}")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomImg(
      @PathVariable("id") String id,
      @RequestPart("file") MultipartFile file) {

    logger.info("Received file: name={}, size={}, contentType={}",
        file.getOriginalFilename(),
        file.getSize(),
        file.getContentType());
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomImg(id, file));
  }

  @PatchMapping("/info/theme-detail-title-line/{id}")
  public ResponseEntity<ResponseDto<EscapeRoomDto>> updateEscapeRoomThemeDetailTitleLine(
      @PathVariable("id") String id,
      @RequestBody EscapeRoomDto escapeRoomDto) {
    return ResponseEntity.ok().body(escapeRoomService.updateEscapeRoomThemeDetailTitleLine(id, escapeRoomDto));
  }
}
