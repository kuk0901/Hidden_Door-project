package com.baeksutalchul.hiddendoor.faq.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baeksutalchul.hiddendoor.dto.FaqDto;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
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

    return new ResponseDto<>(faqDtoList, "FAQ 데이터 반환");
  }

    public ResponseDto<String> addFaq(FaqDto faqDto) {
    
    Faq faq = faqRepository.save(modelMapper.map(faqDto, Faq.class));

    return new ResponseDto<>("", faq.getFaqId() + "번 질문이 추가되었습니다.");
  }

  @Transactional
  public ResponseDto<String> updateFaqOne(FaqDto faqDto) throws CustomException {
    return faqRepository.findById(faqDto.getFaqId())
        .map(currentFaq -> {

          currentFaq.setCategory(faqDto.getCategory());
          currentFaq.setQuestion(faqDto.getQuestion());
          currentFaq.setAnswer(faqDto.getAnswer());
          faqRepository.save(currentFaq);
          return new ResponseDto<>("", "좌석에 대한 정보가 수정되었습니다.");
        })
        .orElseThrow(() -> new CustomException(null));
  }

  @Transactional
  public ResponseDto<String> deleteFaqOne(String id) throws CustomException { 

    Faq faqToDelete = faqRepository.findById(id)
      .orElseThrow(() -> new CustomException(null));
    
      faqRepository.deleteById(id);
    return new ResponseDto<>("", "질문 " + faqToDelete.getFaqId() + "이(가) 삭제되었습니다.");
  }
}