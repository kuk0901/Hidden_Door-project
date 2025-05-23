package com.baeksutalchul.hiddendoor.caution.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baeksutalchul.hiddendoor.caution.domain.Caution;
import com.baeksutalchul.hiddendoor.caution.repository.CautionRepository;

import com.baeksutalchul.hiddendoor.dto.CautionDto;

import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;

import com.baeksutalchul.hiddendoor.res.ResponseDto;

@Service
public class CautionService {
  private CautionRepository cautionRepository;
  private ModelMapper modelMapper;
  private MongoTemplate mongoTemplate;

  public CautionService(CautionRepository cautionRepository, ModelMapper modelMapper, MongoTemplate mongoTemplate) {
    this.cautionRepository = cautionRepository;
    this.modelMapper = modelMapper;
    this.mongoTemplate = mongoTemplate;
  }

  public ResponseDto<List<CautionDto>> getCautionList() {
    List<Caution> cautionList = cautionRepository.findAll();

    List<CautionDto> cautionDtoList = cautionList.stream()
        .map(caution -> modelMapper.map(caution, CautionDto.class))
        .toList();

    String msg = cautionDtoList.isEmpty() ? "주의사항이 없습니다." : "success";

    return new ResponseDto<>(cautionDtoList, msg);
  }

  @Transactional
  public ResponseDto<List<CautionDto>> updateCaution(String cautionId, CautionDto cautionDto) {
    Caution caution = cautionRepository.findById(cautionId)
        .orElseThrow(() -> new CustomException(ErrorCode.CAUTION_NOT_FOUND));

    if (caution.getTitle().equals(cautionDto.getTitle()) &&
        caution.getContent().equals(cautionDto.getContent()) &&
        caution.getIcon().equals(cautionDto.getIcon())) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED, "변경된 사항이 없습니다.");
    }

    Criteria criteria = new Criteria().andOperator(
        Criteria.where("title").is(cautionDto.getTitle()),
        Criteria.where("content").is(cautionDto.getContent()),
        Criteria.where("icon").is(cautionDto.getIcon()),
        Criteria.where("_id").ne(cautionId) // 본인 제외
    );
    Query query = new Query(criteria);

    Caution existingCaution = mongoTemplate.findOne(query, Caution.class);
    if (existingCaution != null) {
      throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 주의사항이 이미 존재합니다.");
    }

    caution.setTitle(cautionDto.getTitle());
    caution.setContent(cautionDto.getContent());
    caution.setIcon(cautionDto.getIcon());
    cautionRepository.save(caution);

    ResponseDto<List<CautionDto>> responseDto = getCautionList();
    responseDto.setMsg("주의사항이 수정되었습니다.");

    return responseDto;
  }

  @Transactional
  public ResponseDto<List<CautionDto>> deleteCautionOne(String cautionId) {
    cautionRepository.findById(cautionId)
        .orElseThrow(() -> new CustomException(ErrorCode.CAUTION_NOT_FOUND));

    cautionRepository.deleteById(cautionId);

    if (!cautionRepository.findById(cautionId).isEmpty()) {
      throw new CustomException(ErrorCode.DELETE_FAILED);
    }

    ResponseDto<List<CautionDto>> responseDto = getCautionList();
    responseDto.setMsg("해당 주의사항이 삭제되었습니다.");

    return responseDto;

  }

  @Transactional
  public ResponseDto<List<CautionDto>> addCautionOne(CautionDto cautionDto) {

    // 중복 검사
    Criteria criteria = new Criteria().andOperator(
        Criteria.where("title").is(cautionDto.getTitle()),
        Criteria.where("content").is(cautionDto.getContent()),
        Criteria.where("icon").is(cautionDto.getIcon()));
    Query query = new Query(criteria);

    Caution existingCaution = mongoTemplate.findOne(query, Caution.class);

    if (existingCaution != null) {
      throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 주의사항이 이미 존재합니다.");
    }

    Caution newCaution = modelMapper.map(cautionDto, Caution.class);
    cautionRepository.save(newCaution);
    ResponseDto<List<CautionDto>> cautionList = getCautionList();
    cautionList.setMsg("주의사항이 추가되었습니다.");

    return cautionList;
  }
}
