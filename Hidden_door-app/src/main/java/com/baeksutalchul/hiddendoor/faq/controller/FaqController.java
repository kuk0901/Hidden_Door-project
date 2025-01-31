package com.baeksutalchul.hiddendoor.faq.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.dto.FaqDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.faq.service.FaqService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

@RestController
@RequestMapping("/api/v1/faqs") // * -> 여기만 복수형태로 작성함
public class FaqController {
  private final FaqService faqService;
  private static final Logger logger = LoggerFactory.getLogger(FaqController.class);

  public FaqController(FaqService faqService) {
    this.faqService = faqService;
  }

  @GetMapping("/list")
  public ResponseEntity<ResponseDto<List<FaqDto>>> getFaqAll() {
    return ResponseEntity.ok().body(faqService.getFaqAll());
  }

  @PostMapping("/faq/add")
  public ResponseEntity<ResponseDto<String>> addFaq(@RequestBody FaqDto faqDto) {
    try {
      logger.info("FaqDto: {}", faqDto);

      ResponseDto<String> res = faqService.addFaq(faqDto);
      return ResponseEntity.ok().body(res);
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
          .body(new ResponseDto<>("", "서버 오류로 인해 좌석 추가에 실패하였습니다. 잠시 후 다시 시도해 주세요."));
    }
  }

  @PutMapping("/faq/update/")
  public ResponseEntity<ResponseDto<?>> updateFaqOne(@RequestBody FaqDto faqDto) {
    try {
      return ResponseEntity.ok().body(faqService.updateFaqOne(faqDto));
    } catch (CustomException e) {
      return ResponseEntity.badRequest().body(new ResponseDto<>("", e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(new ResponseDto<>("", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
    }
  }

  @DeleteMapping("/faq/delete/{id}")
  public ResponseEntity<ResponseDto<String>> deleteFaqOne(@PathVariable("id") String id) {
    try {
      return ResponseEntity.ok().body(faqService.deleteFaqOne(id));
    } catch (CustomException e) {
      return ResponseEntity.badRequest().body(new ResponseDto<>("", e.getMessage()));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(new ResponseDto<>("", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."));
    }
  }
}