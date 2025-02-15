package com.baeksutalchul.hiddendoor.notice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.baeksutalchul.hiddendoor.dto.NoticeDto;
import com.baeksutalchul.hiddendoor.notice.service.NoticeService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notices")
public class NoticeController {

    private static final Logger logger = LoggerFactory.getLogger(NoticeController.class);
    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping("/list")
    public ResponseEntity<ResponseDto<List<NoticeDto>>> getNoticeAll() {
        try {
            ResponseDto<List<NoticeDto>> response = noticeService.getAllNotices();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            logger.error("공지사항 목록 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>(null, "서버 오류로 인해 공지사항 목록 조회에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    @GetMapping("/notice/{id}")
    public ResponseEntity<ResponseDto<NoticeDto>> getNoticeOne(@PathVariable("id") String id) {
        try {
            ResponseDto<NoticeDto> response = noticeService.getNoticeById(id);
            return ResponseEntity.ok().body(response);
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ResponseDto<>(null, e.getMessage()));
        } catch (Exception e) {
            logger.error("공지사항 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>(null, "서버 오류로 인해 공지사항 조회에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    @PostMapping("/notice/add")
    public ResponseEntity<ResponseDto<NoticeDto>> addNotice(@RequestBody NoticeDto noticeDto) {
        try {
            logger.info("NoticeDto: {}", noticeDto);
            ResponseDto<NoticeDto> response = noticeService.createNotice(noticeDto);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            logger.error("공지사항 추가 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>(null, "서버 오류로 인해 공지사항 추가에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    @PutMapping("/notice/update")
    public ResponseEntity<ResponseDto<NoticeDto>> updateNoticeOne(@RequestBody NoticeDto noticeDto) {
        try {
            ResponseDto<NoticeDto> response = noticeService.updateNotice(noticeDto.getId(), noticeDto);
            return ResponseEntity.ok().body(response);
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ResponseDto<>(null, e.getMessage()));
        } catch (Exception e) {
            logger.error("공지사항 수정 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>(null, "서버 오류로 인해 공지사항 수정에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    @DeleteMapping("/notice/delete/{id}")
    public ResponseEntity<ResponseDto<String>> deleteNoticeOne(@PathVariable("id") String id) {
        try {
            noticeService.deleteNotice(id);
            return ResponseEntity.ok().body(new ResponseDto<>("", "공지사항이 성공적으로 삭제되었습니다."));
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ResponseDto<>("", e.getMessage()));
        } catch (Exception e) {
            logger.error("공지사항 삭제 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                .body(new ResponseDto<>("", "서버 오류로 인해 공지사항 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }
}
