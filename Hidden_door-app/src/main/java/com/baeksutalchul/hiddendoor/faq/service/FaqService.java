package com.baeksutalchul.hiddendoor.faq.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.dto.FaqDto;
import com.baeksutalchul.hiddendoor.faq.domain.Faq;
import com.baeksutalchul.hiddendoor.faq.repository.FaqRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;

@Service
public class FaqService {
  private FaqRepository faqRepository;
  private final ModelMapper modelMapper;
  private static final Logger logger = LoggerFactory.getLogger(FaqService.class);

  public FaqService(FaqRepository faqRepository, ModelMapper modelMapper) {
    this.faqRepository = faqRepository;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<List<FaqDto>> getFaqAll() {
    List<Faq> faqList = faqRepository.findAll();

    List<FaqDto> faqDtoList = faqList.stream()
        .map(faq -> modelMapper.map(faq, FaqDto.class))
        .toList();

    return new ResponseDto<>(faqDtoList, "좌석 데이터 반환");
  }
}