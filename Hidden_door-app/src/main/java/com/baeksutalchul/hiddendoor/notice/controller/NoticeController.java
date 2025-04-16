package com.baeksutalchul.hiddendoor.notice.controller;

import com.baeksutalchul.hiddendoor.dto.NoticeDto;
import com.baeksutalchul.hiddendoor.notice.service.NoticeService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

 @RestController
@RequestMapping("/api/v1/notices")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    public ResponseEntity<ResponseDto<Map<String, Object>>> getAllNotices(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortField", defaultValue = "createdAt") String sortField,
            @RequestParam(name = "sortDirection", defaultValue = "DESC") String sortDirection,
            @RequestParam(name = "searchField", required = false) String searchField,
            @RequestParam(name = "searchTerm", required = false) String searchTerm) {

        PageDto pageDto = new PageDto(page + 1, size, 0L, 0, page == 0, false, sortField, sortDirection);
        return ResponseEntity.ok().body(noticeService.getAllNotices(pageDto, searchField, searchTerm));
    }

    @GetMapping("/{noticeId}")
    public ResponseEntity<ResponseDto<NoticeDto>> getNoticeById(@PathVariable("noticeId") String id) {
        return ResponseEntity.ok().body(noticeService.getNoticeById(id));
    }

    @PostMapping
    public ResponseEntity<ResponseDto<NoticeDto>> createNotice(@RequestBody NoticeDto noticeDto) {
        return ResponseEntity.ok().body(noticeService.createNotice(noticeDto));
    }

    @PutMapping("/{noticeId}")
    public ResponseEntity<ResponseDto<NoticeDto>> updateNotice(
            @PathVariable("noticeId") String id, 
            @RequestBody NoticeDto noticeDto) {
        return ResponseEntity.ok().body(noticeService.updateNotice(id, noticeDto));
    }

    @DeleteMapping("/{noticeId}")
    public ResponseEntity<ResponseDto<Map<String, Object>>> deleteNotice(@PathVariable("noticeId") String id) {
        return ResponseEntity.ok().body(noticeService.deleteNotice(id));
    }
}