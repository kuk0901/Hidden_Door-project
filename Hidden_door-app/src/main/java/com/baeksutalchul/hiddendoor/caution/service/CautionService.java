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

    return new ResponseDto<>(cautionDtoList, "success");
  }

  @Transactional
  public ResponseDto<List<CautionDto>> updateCaution(String cautionId, CautionDto cautionDto) {
    Caution caution = cautionRepository.findById(cautionId)
        .orElseThrow(() -> new CustomException(ErrorCode.CAUTION_NOT_FOUND));

    Caution updateCaution = modelMapper.map(cautionDto, Caution.class);

    if (caution.equals(updateCaution)) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    cautionRepository.save(updateCaution);

    ResponseDto<List<CautionDto>> responseDto = getCautionList();
    responseDto.setMsg("주의사항이 수정되었습니다.");

    return responseDto;
  }

  @Transactional
  public ResponseDto<List<CautionDto>> deleteCautionOne(String cautionId) {
    cautionRepository.findById(cautionId)
        .orElseThrow(() -> new CustomException(ErrorCode.CAUTION_NOT_FOUND));

    cautionRepository.deleteById(cautionId);

    boolean isDeleted = !cautionRepository.findById(cautionId).isPresent();

    if (!isDeleted) {
      throw new CustomException(ErrorCode.DELETE_FAILED); // 삭제 실패 시 예외 처리
    }

    ResponseDto<List<CautionDto>> responseDto = getCautionList();
    responseDto.setMsg("해당 주의사항이 삭제되었습니다.");

    return responseDto;

  }

  @Transactional
  public ResponseDto<List<CautionDto>> addCautionOne(CautionDto cautionDto) {

    // 중복 검사
    Criteria criteria = new Criteria().orOperator(
        Criteria.where("originalFileName").is(cautionDto.getTitle()),
        Criteria.where("description").is(cautionDto.getContent()));
    Query query = new Query(criteria);

    Caution existingCaution = mongoTemplate.findOne(query, Caution.class);
    if (existingCaution != null) {
      if (existingCaution.getTitle().equals(cautionDto.getTitle())) {
        throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 주의사항 제목이 이미 존재합니다.");
      } else if (existingCaution.getContent().equals(cautionDto.getContent())) {
        throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 주의사항 설명이 이미 존재합니다.");
      }
    }

    Caution newCaution = modelMapper.map(cautionDto, Caution.class);
    cautionRepository.save(newCaution);
    ResponseDto<List<CautionDto>> cautionList = getCautionList();
    cautionList.setMsg("주의사항이 추가되었습니다.");

    return cautionList;
  }
}
