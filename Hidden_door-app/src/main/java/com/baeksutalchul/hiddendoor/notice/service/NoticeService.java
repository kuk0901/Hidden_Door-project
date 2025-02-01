package com.baeksutalchul.hiddendoor.notice.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.notice.domain.Notice;
import com.baeksutalchul.hiddendoor.notice.repository.NoticeRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;
import com.baeksutalchul.hiddendoor.dto.NoticeDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;

@Service
public class NoticeService {
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
    Notice notice = noticeRepository.findById(id)
        .orElseThrow(() -> new CustomException(ErrorCode.NOTICE_NOT_FOUND));

    NoticeDto noticeDto = modelMapper.map(notice, NoticeDto.class);
    return new ResponseDto<>(noticeDto, "메시지 알아서 ㄱ");
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

}
