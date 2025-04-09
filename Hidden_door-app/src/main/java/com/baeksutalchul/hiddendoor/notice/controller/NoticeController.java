package com.baeksutalchul.hiddendoor.notice.controller;

import com.baeksutalchul.hiddendoor.dto.NoticeDto;
import com.baeksutalchul.hiddendoor.notice.service.NoticeService;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.utils.page.PageDto; // PageDto import
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
            @RequestParam(name = "page", required = false, defaultValue = "1") int page,
            @RequestParam(name = "size", required = false, defaultValue = "10") int size,
            @RequestParam(name = "sortField", required = false, defaultValue = "createdAt") String sortField,
            @RequestParam(name = "sortDirection", required = false, defaultValue = "DESC") String sortDirection,
            @RequestParam(name = "searchField", required = false) String searchField,
            @RequestParam(name = "searchTerm", required = false) String searchTerm) {

        PageDto pageDto = new PageDto(
                page + 1,
                size,
                0L,
                0,
                page == 0,
                false,
                sortField,
                sortDirection);

        return ResponseEntity.ok().body(noticeService.getAllNotices(pageDto, searchField, searchTerm));
    }

    // XXX: 대부분의 try-catch 블럭은 가급적 서비스 레이어에서 사용하는 형태로 수정해 주세요.
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDto<NoticeDto>> getNoticeById(@PathVariable("id") String id) {
        try {
            ResponseDto<NoticeDto> response = noticeService.getNoticeById(id);
            return ResponseEntity.ok().body(response);
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ResponseDto<>(null, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ResponseDto<>(null, "서버 오류로 인해 공지사항 조회에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    // XXX: 대부분의 try-catch 블럭은 가급적 서비스 레이어에서 사용하는 형태로 수정해 주세요.
    @PostMapping
    public ResponseEntity<ResponseDto<NoticeDto>> createNotice(@RequestBody NoticeDto noticeDto) {
        try {

            ResponseDto<NoticeDto> response = noticeService.createNotice(noticeDto);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(new ResponseDto<>(null, "서버 오류로 인해 공지사항 추가에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    // XXX: 대부분의 try-catch 블럭은 가급적 서비스 레이어에서 사용하는 형태로 수정해 주세요.
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDto<NoticeDto>> updateNotice(@PathVariable("id") String id,
            @RequestBody NoticeDto noticeDto) {
        try {
            ResponseDto<NoticeDto> response = noticeService.updateNotice(id, noticeDto);
            return ResponseEntity.ok().body(response);
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ResponseDto<>(null, e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(new ResponseDto<>(null, "서버 오류로 인해 공지사항 수정에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    // XXX: 대부분의 try-catch 블럭은 가급적 서비스 레이어에서 사용하는 형태로 수정해 주세요.
    // XXX: noticeService.deleteNotice(id); 에서 ResponseDto 반환하는 형태로 수정해 주세요.
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto<String>> deleteNotice(@PathVariable("id") String id) {
        try {
            noticeService.deleteNotice(id);
            return ResponseEntity.ok().body(new ResponseDto<>("", "공지사항이 성공적으로 삭제되었습니다."));
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ResponseDto<>("", e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(new ResponseDto<>("", "서버 오류로 인해 공지사항 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }
}
