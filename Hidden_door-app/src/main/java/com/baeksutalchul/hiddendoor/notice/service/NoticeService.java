package com.baeksutalchul.hiddendoor.notice.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.notice.domain.Notice;
import com.baeksutalchul.hiddendoor.notice.repository.NoticeRepository;
import com.baeksutalchul.hiddendoor.dto.NoticeDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;

@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public List<NoticeDto> getAllNotices() {
        List<Notice> notices = noticeRepository.findAll();
        return notices.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public NoticeDto getNoticeById(String id) {
        Optional<Notice> noticeOptional = noticeRepository.findById(id);
        if (noticeOptional.isPresent()) {
            return convertToDto(noticeOptional.get());
        } else {
            throw new CustomException(ErrorCode.NOTICE_NOT_FOUND);
        }
    }

    public NoticeDto createNotice(NoticeDto noticeDto) {
        Notice notice = convertToEntity(noticeDto);
        notice.setCreatedAt(LocalDateTime.now());
        Notice savedNotice = noticeRepository.save(notice);
        return convertToDto(savedNotice);
    }

    public NoticeDto updateNotice(String id, NoticeDto noticeDto) {
        Optional<Notice> noticeOptional = noticeRepository.findById(id);
        if (noticeOptional.isPresent()) {
            Notice notice = noticeOptional.get();
            notice.setTitle(noticeDto.getTitle());
            notice.setContent(noticeDto.getContent());
            Notice updatedNotice = noticeRepository.save(notice);
            return convertToDto(updatedNotice);
        } else {
            throw new CustomException(ErrorCode.NOTICE_NOT_FOUND);
        }
    }

    public void deleteNotice(String id) {
        if (noticeRepository.existsById(id)) {
            noticeRepository.deleteById(id);
        } else {
            throw new CustomException(ErrorCode.NOTICE_NOT_FOUND);
        }
    }

    private NoticeDto convertToDto(Notice notice) {
        return new NoticeDto(notice.getId(), notice.getTitle(), notice.getContent(), notice.getCreatedAt());
    }

    private Notice convertToEntity(NoticeDto noticeDto) {
        return new Notice(noticeDto.getId(), noticeDto.getTitle(), noticeDto.getContent(), noticeDto.getCreatedAt());
    }
}
