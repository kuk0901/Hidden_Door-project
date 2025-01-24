package com.baeksutalchul.hiddendoor.escapeRoom.service;

import org.modelmapper.ModelMapper;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baeksutalchul.hiddendoor.dto.EscapeRoomDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.escapeRoom.repository.EscapeRoomRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.mongodb.client.result.UpdateResult;
import com.baeksutalchul.hiddendoor.escapeRoom.domain.EscapeRoom;

@Service
public class EscapeRoomService {
  private EscapeRoomRepository escapeRoomRepository;
  private ModelMapper modelMapper;
  private MongoTemplate mongoTemplate;

  public EscapeRoomService(EscapeRoomRepository escapeRoomRepository, ModelMapper modelMapper,
      MongoTemplate mongoTemplate) {
    this.escapeRoomRepository = escapeRoomRepository;
    this.modelMapper = modelMapper;
    this.mongoTemplate = mongoTemplate;
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

  @Transactional
  public ResponseDto<EscapeRoomDto> updateEscapeRoomTitle(EscapeRoomDto escapeRoomDto) {
    EscapeRoom existingEscapeRoom = findEscapeRoomById(escapeRoomDto.getRoomId());

    if (existingEscapeRoom.getTitle().equals(escapeRoomDto.getTitle())) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    Query query = new Query(Criteria.where("roomId").is(escapeRoomDto.getRoomId()));
    Update update = new Update().set("title", escapeRoomDto.getTitle());

    UpdateResult result = mongoTemplate.updateFirst(query, update, EscapeRoom.class);

    if (result.getModifiedCount() == 0) {
      throw new CustomException(ErrorCode.UPDATE_FAILED);
    }

    EscapeRoom updatedEscapeRoom = findEscapeRoomById(escapeRoomDto.getRoomId());
    EscapeRoomDto updatedDto = modelMapper.map(updatedEscapeRoom, EscapeRoomDto.class);

    return new ResponseDto<>(updatedDto, "방탈출 제목이 업데이트되었습니다.");
  }

  @Transactional
  public ResponseDto<EscapeRoomDto> updateEscapeRoomExplanation(EscapeRoomDto escapeRoomDto) {
    EscapeRoom existingEscapeRoom = findEscapeRoomById(escapeRoomDto.getRoomId());

    if (existingEscapeRoom.getExplanation().equals(escapeRoomDto.getExplanation())) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    Query query = new Query(Criteria.where("roomId").is(escapeRoomDto.getRoomId()));
    Update update = new Update().set("explanation", escapeRoomDto.getExplanation());

    UpdateResult result = mongoTemplate.updateFirst(query, update, EscapeRoom.class);

    if (result.getModifiedCount() == 0) {
      throw new CustomException(ErrorCode.UPDATE_FAILED);
    }

    EscapeRoom updatedEscapeRoom = findEscapeRoomById(escapeRoomDto.getRoomId());
    EscapeRoomDto updatedDto = modelMapper.map(updatedEscapeRoom, EscapeRoomDto.class);

    return new ResponseDto<>(updatedDto, "방탈출 설명이 업데이트되었습니다.");
  }

  @Transactional
  public ResponseDto<EscapeRoomDto> updateEscapeRoomThemeTitleLine(EscapeRoomDto escapeRoomDto) {
    EscapeRoom existingEscapeRoom = findEscapeRoomById(escapeRoomDto.getRoomId());

    if (existingEscapeRoom.getExplanation().equals(escapeRoomDto.getExplanation())) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    Query query = new Query(Criteria.where("roomId").is(escapeRoomDto.getRoomId()));
    Update update = new Update()
        .set("themeHeaderTitle", escapeRoomDto.getThemeHeaderTitle())
        .set("themeHeaderSubtitle", escapeRoomDto.getThemeHeaderSubtitle());

    UpdateResult result = mongoTemplate.updateFirst(query, update, EscapeRoom.class);

    if (result.getModifiedCount() == 0) {
      throw new CustomException(ErrorCode.UPDATE_FAILED);
    }

    EscapeRoom updatedEscapeRoom = findEscapeRoomById(escapeRoomDto.getRoomId());
    EscapeRoomDto updatedDto = modelMapper.map(updatedEscapeRoom, EscapeRoomDto.class);

    return new ResponseDto<>(updatedDto, "방탈출 설명이 업데이트되었습니다.");
  }

  private EscapeRoom findEscapeRoomById(String roomId) {
    return escapeRoomRepository.findById(roomId)
        .orElseThrow(() -> new CustomException(ErrorCode.ESCAPE_ROOM_NOT_FOUND));
  }

}
