package com.baeksutalchul.hiddendoor.faq.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baeksutalchul.hiddendoor.admin.domain.Admin;
import com.baeksutalchul.hiddendoor.dto.FaqDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.faq.domain.Faq;
import com.baeksutalchul.hiddendoor.faq.repository.FaqRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.format.DateTimeUtil;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;
import com.baeksutalchul.hiddendoor.utils.page.PageableUtil;

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

  public ResponseDto<List<FaqDto>> getFaqAll(PageDto pageDto, String searchField, String searchTerm) {
        Pageable pageable = PageableUtil.createPageRequest(
        Math.max(0, pageDto.getPage() - 1),
        pageDto.getSize(),
        pageDto.getSortField(),
        pageDto.getSortDirection());

    Page<Faq> faqList;

    if (searchTerm != null && !searchTerm.trim().isEmpty()) {
      switch (searchField) {
        case "title":
        faqList = faqRepository.findByTitleContaining(searchTerm, pageable);
          break;
        case "question":
        faqList = faqRepository.findByQuestionContaining(searchTerm, pageable);
          break;
        default:
        faqList = faqRepository.findByTitleContainingOrQuestionContaining(searchTerm, searchTerm, pageable);
      }
    } else {
      faqList = faqRepository.findAll(pageable);
    }
    if (faqList.isEmpty()) {
      throw new CustomException(ErrorCode.FAQ_NOT_FOUND);
    }

    List<FaqDto> faqDtoList = faqList.getContent().stream()
        .map(faq -> modelMapper.map(faq, FaqDto.class))
        .toList();

        PageDto resultPageDto = PageableUtil.createPageDto(faqList);
        logger.info("resultPageDto: {}", resultPageDto);

        return new ResponseDto<>(faqDtoList, "success", resultPageDto, searchField, searchTerm);
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

  public ResponseDto<FaqDto> updateFaqOne(String id, FaqDto faqDto) {
    // ID로 해당 FAQ를 조회
    Faq faq = faqRepository.findById(id).orElseThrow();

    // faqDto에서 받은 정보를 이용하여 faq 업데이트
    faq.setTitle(faqDto.getTitle());
    faq.setQuestion(faqDto.getQuestion());
    faq.setAnswer(faqDto.getAnswer());
    faq.setModDate(Instant.now());

    // 저장 후 결과 반환
    Faq updatedFaq = faqRepository.save(faq);
    FaqDto updatedFaqDto = modelMapper.map(updatedFaq, FaqDto.class);

    return new ResponseDto<>(updatedFaqDto,  "질문 " + faq.getTitle() +"이(가) 수정되었습니다");
}

  @Transactional
  public ResponseDto<String> deleteFaqOne(String id) throws CustomException {

    Faq faqToDelete = faqRepository.findById(id)
        .orElseThrow(() -> new CustomException(null));

    faqRepository.deleteById(id);
    return new ResponseDto<>("", "질문 " + faqToDelete.getTitle() + "이(가) 삭제되었습니다.");
  }
}