package com.baeksutalchul.hiddendoor.notice.service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baeksutalchul.hiddendoor.notice.domain.Notice;
import com.baeksutalchul.hiddendoor.notice.repository.NoticeRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;
import com.baeksutalchul.hiddendoor.utils.page.PageableUtil;
import com.baeksutalchul.hiddendoor.dto.NoticeDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;

import org.springframework.data.domain.Pageable;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final ModelMapper modelMapper;

    public NoticeService(NoticeRepository noticeRepository, ModelMapper modelMapper) {
        this.noticeRepository = noticeRepository;
        this.modelMapper = modelMapper;
    }

    public ResponseDto<Map<String, Object>> getAllNotices(PageDto pageDto, String searchField, String searchTerm) {
        Pageable pageable = PageableUtil.createPageRequest(
                pageDto.getPage() - 1,
                pageDto.getSize(),
                pageDto.getSortField(),
                pageDto.getSortDirection());

        Page<Notice> noticePage;

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            switch (searchField) {
                case "title":
                    noticePage = noticeRepository.findByTitleContaining(searchTerm, pageable);
                    break;
                case "content":
                    noticePage = noticeRepository.findByContentContaining(searchTerm, pageable);
                    break;
                default:
                    noticePage = noticeRepository.findByTitleContainingOrContentContaining(searchTerm, searchTerm, pageable);
            }
        } else {
            noticePage = noticeRepository.findAll(pageable);
        }

        List<NoticeDto> noticeDtoList = noticePage.getContent().stream()
                .map(notice -> {
                    NoticeDto dto = modelMapper.map(notice, NoticeDto.class);
                    dto.setKstCreatedAt(DateTimeUtil.convertToKoreanDate(dto.getCreatedAt()));
                    return dto;
                })
                .toList();

        PageDto resultPageDto = PageableUtil.createPageDto(noticePage);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("content", noticeDtoList);
        responseData.put("page", resultPageDto);

        return new ResponseDto<>(responseData, "success");
    }

    public ResponseDto<NoticeDto> getNoticeById(String id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));
        NoticeDto noticeDto = modelMapper.map(notice, NoticeDto.class);
        return new ResponseDto<>(noticeDto, "공지사항을 성공적으로 조회했습니다.");
    }

    public ResponseDto<NoticeDto> createNotice(NoticeDto noticeDto) {
        Notice notice = modelMapper.map(noticeDto, Notice.class);

        Notice savedNotice = noticeRepository.save(notice);

        NoticeDto noticeDtoResult = modelMapper.map(savedNotice, NoticeDto.class);

        return new ResponseDto<>(noticeDtoResult, "공지사항이 성공적으로 생성되었습니다.");
    }

    public ResponseDto<NoticeDto> updateNotice(String id, NoticeDto noticeDto) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));

        notice.setTitle(noticeDto.getTitle());
        notice.setContent(noticeDto.getContent());

        Notice updatedNotice = noticeRepository.save(notice);

        NoticeDto noticeDtoResult = modelMapper.map(updatedNotice, NoticeDto.class);
        noticeDtoResult.setKstCreatedAt(DateTimeUtil.convertToKoreanDateTime(notice.getCreatedAt()));

        return new ResponseDto<>(noticeDtoResult, "공지사항이 성공적으로 수정되었습니다.");
    }

    @Transactional
    public ResponseDto<Map<String, Object>> deleteNotice(String noticeId) {
        
        noticeRepository.findById(noticeId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));
        
        noticeRepository.deleteById(noticeId);

        
        if (noticeRepository.findById(noticeId).isPresent()) {
            throw new CustomException(ErrorCode.DELETE_FAILED);
        }

        PageDto defaultPageInfo = new PageDto(1, PageableUtil.DEFAULT_SIZE,
                                              0L, 0,
                                              true, true,
                                              PageableUtil.DEFAULT_SORT_FIELD,
                                              PageableUtil.DEFAULT_SORT_DIRECTION);

        return getAllNotices(defaultPageInfo, null, null);
    }
}
