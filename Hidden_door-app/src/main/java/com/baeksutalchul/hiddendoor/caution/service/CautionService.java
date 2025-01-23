package com.baeksutalchul.hiddendoor.caution.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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

  public CautionService(CautionRepository cautionRepository, ModelMapper modelMapper) {
    this.cautionRepository = cautionRepository;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<List<Caution>> getCautionList() {
    List<Caution> cautionList = cautionRepository.findAll();

    return new ResponseDto<>(cautionList, "주의사항 리스트입니다.");
  }

  public ResponseDto<List<Caution>> updateCaution(String cautionId, CautionDto cautionDto) {
    Caution caution = cautionRepository.findById(cautionId)
        .orElseThrow(() -> new CustomException(ErrorCode.CAUTION_NOT_FOUND));

    Caution updateCaution = modelMapper.map(cautionDto, Caution.class);

    if (caution.equals(updateCaution)) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    cautionRepository.save(updateCaution);

    ResponseDto<List<Caution>> responseDto = getCautionList();
    responseDto.setMsg("주의사항이 수정되었습니다.");

    return responseDto;
  }

  public ResponseDto<List<Caution>> deleteCautionOne(String cautionId) {
    cautionRepository.findById(cautionId)
        .orElseThrow(() -> new CustomException(ErrorCode.CAUTION_NOT_FOUND));

    cautionRepository.deleteById(cautionId);

    boolean isDeleted = !cautionRepository.findById(cautionId).isPresent();

    if (!isDeleted) {
      throw new CustomException(ErrorCode.DELETE_FAILED); // 삭제 실패 시 예외 처리
    }

    ResponseDto<List<Caution>> responseDto = getCautionList();
    responseDto.setMsg("해당 주의사항이 삭제되었습니다.");

    return responseDto;

  }
}
