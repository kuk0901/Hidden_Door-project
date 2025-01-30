package com.baeksutalchul.hiddendoor.caution.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.caution.service.CautionService;
import com.baeksutalchul.hiddendoor.dto.CautionDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/cautions")
public class CautionController {
  private CautionService cautionService;

  private static final Logger logger = LoggerFactory.getLogger(CautionController.class);

  public CautionController(CautionService cautionService) {
    this.cautionService = cautionService;
  }

  @GetMapping("/list")
  public ResponseEntity<ResponseDto<List<CautionDto>>> getCautionList() {
    return ResponseEntity.ok().body(cautionService.getCautionList());
  }

  @PutMapping("/caution/{id}")
  public ResponseEntity<ResponseDto<List<CautionDto>>> postMethodName(@PathVariable("id") String cautionId,
      @RequestBody CautionDto cautionDto) {

    return ResponseEntity.ok().body(cautionService.updateCaution(cautionId, cautionDto));
  }

  @DeleteMapping("/caution/{id}")
  public ResponseEntity<ResponseDto<List<CautionDto>>> deleteCautionOne(@PathVariable("id") String cautionId) {
    return ResponseEntity.ok().body(cautionService.deleteCautionOne(cautionId));
  }

  @PostMapping("/caution/add")
  public ResponseEntity<ResponseDto<List<CautionDto>>> addCautionOne(@RequestBody CautionDto cautionDto) {
    return ResponseEntity.ok().body(cautionService.addCautionOne(cautionDto));
  }

}
