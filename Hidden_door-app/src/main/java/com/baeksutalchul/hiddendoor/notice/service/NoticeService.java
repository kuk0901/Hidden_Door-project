package com.baeksutalchul.hiddendoor.notice.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.notice.domain.Notice;
import com.baeksutalchul.hiddendoor.notice.repository.NoticeRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;
import com.baeksutalchul.hiddendoor.utils.page.PageableUtil;
import com.baeksutalchul.hiddendoor.dto.NoticeDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class NoticeService {

  private static final Logger logger = LoggerFactory.getLogger(NoticeService.class);
  
  private final NoticeRepository noticeRepository;
  private final ModelMapper modelMapper;

  public NoticeService(NoticeRepository noticeRepository, ModelMapper modelMapper) {
    this.noticeRepository = noticeRepository;
    this.modelMapper = modelMapper;
  }

  // TODO: 모든 반환 데이터는 ResponseDto
  // TODO: 데이터 변환은 modelMapper 사용

  public ResponseDto<List<NoticeDto>> getAllNotices() {
    List<Notice> noticeList = noticeRepository.findAll();

    List<NoticeDto> noticeDtoList = noticeList.stream().map(notice -> {
      NoticeDto noticeDto = modelMapper.map(notice, NoticeDto.class);
      noticeDto.setKstCreatedAt(DateTimeUtil.convertToKoreanDate(noticeDto.getCreatedAt()));

      return noticeDto;
    }).toList();

    return new ResponseDto<>(noticeDtoList, "success");
  }

  public ResponseDto<NoticeDto> getNoticeById(String id) {
    try {
        Notice notice = noticeRepository.findById(id)
            .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));
        NoticeDto noticeDto = modelMapper.map(notice, NoticeDto.class);
        return new ResponseDto<>(noticeDto, "공지사항을 성공적으로 조회했습니다.");
    } catch (CustomException e) {
        return new ResponseDto<>(null, e.getMessage());
    }
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
    noticeDtoResult.setKstCreatedAt(DateTimeUtil.convertToKoreanDateTime(noticeDtoResult.getCreatedAt()));

    return new ResponseDto<>(noticeDtoResult, "공지사항이 성공적으로 수정되었습니다.");
  }

  public void deleteNotice(String id) {
    if (noticeRepository.existsById(id)) {
      noticeRepository.deleteById(id);
    } else {
      throw new CustomException(ErrorCode.NOTICE_NOT_FOUND);
    }
  }

  public ResponseDto<Page<NoticeDto>> getAllNotices(int page, int size, String sortField, String sortDirection) {
    // 클라이언트에서 받은 페이지 번호(1-based)를 0-based로 변환
    int adjustedPage = Math.max(0, page - 1);
    
    Pageable pageable = PageableUtil.createPageRequest(adjustedPage, size, sortField, sortDirection);
    Page<Notice> noticePage = noticeRepository.findAll(pageable);

    Page<NoticeDto> noticeDtoPage = noticePage.map(notice -> {
        NoticeDto noticeDto = modelMapper.map(notice, NoticeDto.class);
        noticeDto.setKstCreatedAt(DateTimeUtil.convertToKoreanDate(noticeDto.getCreatedAt()));
        return noticeDto;
    });

    return new ResponseDto<>(noticeDtoPage, "공지사항 목록을 성공적으로 조회했습니다.");
}

}
