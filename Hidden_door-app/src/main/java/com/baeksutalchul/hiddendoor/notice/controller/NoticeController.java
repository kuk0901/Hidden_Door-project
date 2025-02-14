package com.baeksutalchul.hiddendoor.notice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.baeksutalchul.hiddendoor.dto.NoticeDto;
import com.baeksutalchul.hiddendoor.notice.service.NoticeService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

import org.springframework.http.HttpStatus;
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

    // 공지사항 전체 조회
    @GetMapping
    public ResponseEntity<List<NoticeDto>> getAllNotices() {
        List<NoticeDto> notices = noticeService.getAllNotices().getData();
        return new ResponseEntity<>(notices, HttpStatus.OK);
    }

    // 공지사항 ID로 조회
    @GetMapping("/{id}")
    public ResponseEntity<NoticeDto> getNoticeById(@PathVariable("id") String id) {
        NoticeDto notice = noticeService.getNoticeById(id).getData();
        return new ResponseEntity<>(notice, HttpStatus.OK);
    }

    // 새로운 공지사항 생성
    // PostMapping("/notice/add")
    @PostMapping
    public ResponseEntity<NoticeDto> createNotice(@RequestBody NoticeDto noticeDto) {
        NoticeDto createdNotice = noticeService.createNotice(noticeDto).getData();
        return new ResponseEntity<>(createdNotice, HttpStatus.CREATED);
    }

    // 공지사항 수정
    @PutMapping("/{id}")
    public ResponseEntity<NoticeDto> updateNotice(@PathVariable("id") String id, @RequestBody NoticeDto noticeDto) {
        NoticeDto updatedNotice = noticeService.updateNotice(id, noticeDto).getData();
        return new ResponseEntity<>(updatedNotice, HttpStatus.OK);
    }

    // 공지사항 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable("id") String id) {
        noticeService.deleteNotice(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
