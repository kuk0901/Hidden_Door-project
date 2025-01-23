package com.baeksutalchul.hiddendoor.escapeRoom.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.dto.EscapeRoomDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.escapeRoom.repository.EscapeRoomRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.escapeRoom.domain.EscapeRoom;

import java.util.Optional;

@Service
public class EscapeRoomService {
  private EscapeRoomRepository escapeRoomRepository;
  private ModelMapper modelMapper;

  public EscapeRoomService(EscapeRoomRepository escapeRoomRepository, ModelMapper modelMapper) {
    this.escapeRoomRepository = escapeRoomRepository;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<EscapeRoomDto> getEscapeRoomInfo() {
    return escapeRoomRepository.findAll().stream()
        .findFirst()
        .map(escapeRoom -> {
          EscapeRoomDto dto = modelMapper.map(escapeRoom, EscapeRoomDto.class);
          return new ResponseDto<>(dto, "방탈출 정보입니다.");
        })
        .orElseThrow(() -> new CustomException(ErrorCode.ESCAPE_ROOM_NOT_FOUND));
  }

  public ResponseDto<EscapeRoomDto> updateEscapeRoomInfo(EscapeRoomDto escapeRoomDto) {
    // 1. Optional로 EscapeRoom 조회
    EscapeRoom escapeRoom = escapeRoomRepository.findById(escapeRoomDto.getRoomId())
        .orElseThrow(() -> new CustomException(ErrorCode.ESCAPE_ROOM_NOT_FOUND));

    // 2. DTO를 Entity로 변환
    EscapeRoom updatedEscapeRoom = modelMapper.map(escapeRoomDto, EscapeRoom.class);

    // 3. 변경사항 확인
    if (escapeRoom.equals(updatedEscapeRoom)) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    // 4. 엔티티 업데이트 및 저장
    EscapeRoom savedEscapeRoom = escapeRoomRepository.save(updatedEscapeRoom);

    // 5. DTO로 변환하여 반환
    EscapeRoomDto responseDto = modelMapper.map(savedEscapeRoom, EscapeRoomDto.class);

    return new ResponseDto<>(responseDto, "방탈출 정보가 업데이트되었습니다.");
  }

}
