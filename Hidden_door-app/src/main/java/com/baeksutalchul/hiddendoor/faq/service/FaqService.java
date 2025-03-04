package com.baeksutalchul.hiddendoor.faq.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baeksutalchul.hiddendoor.dto.FaqDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.faq.domain.Faq;
import com.baeksutalchul.hiddendoor.faq.repository.FaqRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;

@Service
public class FaqService {
  private MongoTemplate mongoTemplate;
  private FaqRepository faqRepository;
  private final ModelMapper modelMapper;
  private final Logger logger = LoggerFactory.getLogger(FaqService.class);

  public FaqService(FaqRepository faqRepository, ModelMapper modelMapper, MongoTemplate mongoTemplate) {
    this.mongoTemplate =mongoTemplate;
    this.faqRepository = faqRepository;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<List<FaqDto>> getFaqAll() {
    List<Faq> faqList = faqRepository.findAll();

    if (faqList.isEmpty()) {
      throw new CustomException(ErrorCode.FAQ_NOT_FOUND);
    }

    List<FaqDto> faqDtoList = faqList.stream()
        .map(faq -> {
          FaqDto faqDto = modelMapper.map(faq, FaqDto.class);
          faqDto.setKstCreDate(DateTimeUtil.convertToKoreanDate(faq.getCreDate()));
          faqDto.setKstModDate(DateTimeUtil.convertToKoreanDateTime(faq.getModDate()));

          return faqDto;
        })
        .toList();

    logger.info("faqDtoList: {}", faqDtoList);

    return new ResponseDto<>(faqDtoList, "FAQ 데이터 반환");
  }

  public ResponseDto<FaqDto> getFaqById(String faqId) {
    Optional<Faq> faqOptional = faqRepository.findById(faqId);

    if (faqOptional.isPresent()) {
      Faq faq = faqOptional.get();
      FaqDto faqDto = modelMapper.map(faq, FaqDto.class);

      faqDto.setKstCreDate(DateTimeUtil.convertToKoreanDate(faq.getCreDate()));
      faqDto.setKstModDate(DateTimeUtil.convertToKoreanDateTime(faq.getModDate()));

      return new ResponseDto<>(faqDto, "FAQ 상세 정보 반환");
    } else {
      return new ResponseDto<>(null, "FAQ 정보를 찾을 수 없습니다.");
    }

  }

  @Transactional
  public ResponseDto<FaqDto> addFaq(FaqDto faqDto) {

    Faq faq = new Faq();
    faq.setWriter(faqDto.getWriter());
    faq.setTitle(faqDto.getTitle());
    faq.setCategory(faqDto.getCategory());
    faq.setQuestion(faqDto.getQuestion());
    faq.setAnswer(faqDto.getAnswer());
    faq.setCreDate(Instant.now());
    faq.setModDate(Instant.now());

    Faq saveFaq = mongoTemplate.save(faq);

    FaqDto resFaqDto = modelMapper.map(saveFaq, FaqDto.class);

    return new ResponseDto<>(resFaqDto, faq.getTitle() + "의 질문이 추가되었습니다.");
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
    return new ResponseDto<>("", "질문 " + faqToDelete.getTitle() + "이(가) 삭제되었습니다.");
  }
}