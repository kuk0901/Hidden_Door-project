package com.baeksutalchul.hiddendoor.escapeRoom.service;

import java.io.IOException;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.baeksutalchul.hiddendoor.dto.EscapeRoomDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.escapeRoom.repository.EscapeRoomRepository;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.file.FileUtils;
import com.mongodb.client.result.UpdateResult;
import com.baeksutalchul.hiddendoor.escapeRoom.domain.EscapeRoom;

@Service
public class EscapeRoomService {
  private EscapeRoomRepository escapeRoomRepository;
  private ModelMapper modelMapper;
  private MongoTemplate mongoTemplate;
  private FileUtils fileUtils;

  public EscapeRoomService(EscapeRoomRepository escapeRoomRepository, ModelMapper modelMapper,
      MongoTemplate mongoTemplate, FileUtils fileUtils) {
    this.escapeRoomRepository = escapeRoomRepository;
    this.modelMapper = modelMapper;
    this.mongoTemplate = mongoTemplate;
    this.fileUtils = fileUtils;
  }

  // common
  public ResponseDto<EscapeRoomDto> getEscapeRoomInfo() {
    Optional<EscapeRoom> optionalEscapeRoom = escapeRoomRepository.findAll().stream().findFirst();

    if (optionalEscapeRoom.isPresent()) {
      EscapeRoomDto dto = modelMapper.map(optionalEscapeRoom.get(), EscapeRoomDto.class);
      return new ResponseDto<>(dto, "방탈출 정보입니다.");
    }

    return new ResponseDto<>(null, "방탈출 정보가 없습니다.");
  }

  // admin
  @Transactional
  public ResponseDto<EscapeRoomDto> updateEscapeRoomTitle(String id, EscapeRoomDto escapeRoomDto) {
    EscapeRoom existingEscapeRoom = findEscapeRoomById(id);

    if (existingEscapeRoom.getTitle().equals(escapeRoomDto.getTitle())) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    Query query = new Query(Criteria.where("roomId").is(id));
    Update update = new Update().set("title", escapeRoomDto.getTitle());

    UpdateResult result = mongoTemplate.updateFirst(query, update, EscapeRoom.class);

    if (result.getModifiedCount() == 0) {
      throw new CustomException(ErrorCode.UPDATE_FAILED);
    }

    EscapeRoom updatedEscapeRoom = findEscapeRoomById(id);
    EscapeRoomDto updatedDto = modelMapper.map(updatedEscapeRoom, EscapeRoomDto.class);

    return new ResponseDto<>(updatedDto, "방탈출 제목이 업데이트되었습니다.");
  }

  @Transactional
  public ResponseDto<EscapeRoomDto> updateEscapeRoomExplanation(String id, EscapeRoomDto escapeRoomDto) {
    EscapeRoom existingEscapeRoom = findEscapeRoomById(id);

    if (existingEscapeRoom.getExplanation().equals(escapeRoomDto.getExplanation())) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    Query query = new Query(Criteria.where("roomId").is(id));
    Update update = new Update().set("explanation", escapeRoomDto.getExplanation());

    UpdateResult result = mongoTemplate.updateFirst(query, update, EscapeRoom.class);

    if (result.getModifiedCount() == 0) {
      throw new CustomException(ErrorCode.UPDATE_FAILED);
    }

    EscapeRoom updatedEscapeRoom = findEscapeRoomById(id);
    EscapeRoomDto updatedDto = modelMapper.map(updatedEscapeRoom, EscapeRoomDto.class);

    return new ResponseDto<>(updatedDto, "방탈출 설명이 업데이트되었습니다.");
  }

  @Transactional
  public ResponseDto<EscapeRoomDto> updateEscapeRoomThemeTitleLine(String id, EscapeRoomDto escapeRoomDto) {
    EscapeRoom existingEscapeRoom = findEscapeRoomById(id);

    if (existingEscapeRoom.getThemeHeaderTitle().equals(escapeRoomDto.getThemeHeaderTitle())
        && existingEscapeRoom.getThemeHeaderSubtitle().equals(escapeRoomDto.getThemeHeaderSubtitle())) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    Query query = new Query(Criteria.where("roomId").is(id));
    Update update = new Update()
        .set("themeHeaderTitle", escapeRoomDto.getThemeHeaderTitle())
        .set("themeHeaderSubtitle", escapeRoomDto.getThemeHeaderSubtitle());

    UpdateResult result = mongoTemplate.updateFirst(query, update, EscapeRoom.class);

    if (result.getModifiedCount() == 0) {
      throw new CustomException(ErrorCode.UPDATE_FAILED);
    }

    EscapeRoom updatedEscapeRoom = findEscapeRoomById(id);
    EscapeRoomDto updatedDto = modelMapper.map(updatedEscapeRoom, EscapeRoomDto.class);

    return new ResponseDto<>(updatedDto, "방탈출 설명이 업데이트되었습니다.");
  }

  @Transactional
  public ResponseDto<EscapeRoomDto> updateEscapeRoomThemeExplanationLine(String id, EscapeRoomDto escapeRoomDto) {
    EscapeRoom existingEscapeRoom = findEscapeRoomById(id);

    if (existingEscapeRoom.getThemeExplanation().equals(escapeRoomDto.getThemeExplanation())) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    Query query = new Query(Criteria.where("roomId").is(id));
    Update update = new Update()
        .set("themeTitle", escapeRoomDto.getThemeTitle())
        .set("themeExplanation", escapeRoomDto.getThemeExplanation());

    UpdateResult result = mongoTemplate.updateFirst(query, update, EscapeRoom.class);

    if (result.getModifiedCount() == 0) {
      throw new CustomException(ErrorCode.UPDATE_FAILED);
    }

    EscapeRoom updatedEscapeRoom = findEscapeRoomById(id);
    EscapeRoomDto updatedDto = modelMapper.map(updatedEscapeRoom, EscapeRoomDto.class);

    return new ResponseDto<>(updatedDto, "테마 설명이 업데이트되었습니다.");
  }

  private EscapeRoom findEscapeRoomById(String roomId) {
    return escapeRoomRepository.findById(roomId)
        .orElseThrow(() -> new CustomException(ErrorCode.ESCAPE_ROOM_NOT_FOUND));
  }

  @Transactional
  public ResponseDto<EscapeRoomDto> updateEscapeRoomImg(String roomId, MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new CustomException(ErrorCode.INVALID_INPUT, "파일이 없습니다.");
    }

    EscapeRoom escapeRoom = escapeRoomRepository.findById(roomId)
        .orElseThrow(() -> new CustomException(ErrorCode.ESCAPE_ROOM_NOT_FOUND));

    if (escapeRoom.getOriginalFileName().equals(file.getOriginalFilename())) {
      throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 이미지입니다.");
    }

    String deleteStoredFileName = escapeRoom.getStoredFileName();

    // 파일 저장
    try {
      String storedFileName = fileUtils.saveFile(file);
      escapeRoom.setOriginalFileName(file.getOriginalFilename());
      escapeRoom.setStoredFileName(storedFileName);
    } catch (IOException e) {
      throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
    }

    // DB 저장
    escapeRoomRepository.save(escapeRoom);

    fileUtils.deleteFile(deleteStoredFileName);

    ResponseDto<EscapeRoomDto> updateEscapeRoom = getEscapeRoomInfo();
    updateEscapeRoom.setMsg("방탈출 이미지가 변경되었습니다.");

    return updateEscapeRoom;
  }

  @Transactional
  public ResponseDto<EscapeRoomDto> updateEscapeRoomThemeDetailTitleLine(String id, EscapeRoomDto escapeRoomDto) {
    EscapeRoom existingEscapeRoom = findEscapeRoomById(id);

    if (existingEscapeRoom.getThemeDetailHeaderTitle().equals(escapeRoomDto.getThemeDetailHeaderTitle())
        && existingEscapeRoom.getThemeDetailHeaderSubtitle().equals(escapeRoomDto.getThemeDetailHeaderSubtitle())) {
      throw new CustomException(ErrorCode.NO_CHANGES_DETECTED);
    }

    Query query = new Query(Criteria.where("roomId").is(id));
    Update update = new Update()
        .set("themeDetailHeaderTitle", escapeRoomDto.getThemeDetailHeaderTitle())
        .set("themeDetailHeaderSubtitle", escapeRoomDto.getThemeDetailHeaderSubtitle());

    UpdateResult result = mongoTemplate.updateFirst(query, update, EscapeRoom.class);

    if (result.getModifiedCount() == 0) {
      throw new CustomException(ErrorCode.UPDATE_FAILED);
    }

    EscapeRoom updatedEscapeRoom = findEscapeRoomById(id);
    EscapeRoomDto updatedDto = modelMapper.map(updatedEscapeRoom, EscapeRoomDto.class);

    return new ResponseDto<>(updatedDto, "테마 상세 페이지의 제목이 업데이트되었습니다.");
  }

}
