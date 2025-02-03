package com.baeksutalchul.hiddendoor.theme.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.baeksutalchul.hiddendoor.dto.ThemeDto;
import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.theme.domain.Theme;
import com.baeksutalchul.hiddendoor.theme.repository.ThemeRepository;
import com.baeksutalchul.hiddendoor.utils.file.FileUtils;

@Service
public class ThemeService {
  private ThemeRepository themeRepository;
  private FileUtils fileUtils;
  private MongoTemplate mongoTemplate;
  private ModelMapper modelMapper;

  public ThemeService(ThemeRepository themeRepository, FileUtils fileUtils, MongoTemplate mongoTemplate,
      ModelMapper modelMapper) {
    this.themeRepository = themeRepository;
    this.fileUtils = fileUtils;
    this.mongoTemplate = mongoTemplate;
    this.modelMapper = modelMapper;
  }

  public ResponseDto<List<ThemeDto>> getAllTheme() {
    List<Theme> themeList = themeRepository.findAll();

    if (themeList.isEmpty()) {
      throw new CustomException(ErrorCode.THEME_NOT_FOUND);
    }

    List<ThemeDto> themeDtoList = themeList.stream()
        .map(theme -> modelMapper.map(theme, ThemeDto.class))
        .toList();

    return new ResponseDto<>(themeDtoList, "success");
  }

  public ResponseDto<Theme> getThemeById(String id) {
    Theme theme = themeRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.THEME_NOT_FOUND));
    return new ResponseDto<>(theme, "success");
  }

  @Transactional
  public ResponseDto<List<ThemeDto>> addThemeWithFile(ThemeDto themeDto, MultipartFile file) {
    // 파일 이름을 themeDto에 설정
    if (file != null && !file.isEmpty()) {
      themeDto.setOriginalFileName(file.getOriginalFilename());
    }

    // 중복 검사
    Criteria criteria = new Criteria().orOperator(
        Criteria.where("themeName").is(themeDto.getThemeName()),
        Criteria.where("originalFileName").is(themeDto.getOriginalFileName()),
        Criteria.where("description").is(themeDto.getDescription()));
    Query query = new Query(criteria);

    Theme existingTheme = mongoTemplate.findOne(query, Theme.class);
    if (existingTheme != null) {
      if (existingTheme.getThemeName().equals(themeDto.getThemeName())) {
        throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 테마 이름이 이미 존재합니다.");
      } else if (existingTheme.getOriginalFileName().equals(themeDto.getOriginalFileName())) {
        throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 이미지가 이미 존재합니다.");
      } else {
        throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 테마 설명이 이미 존재합니다.");
      }
    }

    try {
      String storedFileName = fileUtils.saveFile(file);
      themeDto.setStoredFileName(storedFileName);
    } catch (IOException e) {
      throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
    }

    // 4. db 저장
    Theme savedTheme = modelMapper.map(themeDto, Theme.class);
    themeRepository.save(savedTheme);

    ResponseDto<List<ThemeDto>> themeList = getAllTheme();
    themeList.setMsg("작성하신 테마 정보가 추가되었습니다.");

    return themeList;
  }

  @Transactional
  public ResponseDto<List<ThemeDto>> updateThemeWithFile(ThemeDto themeDto, MultipartFile file) {
    Theme theme = themeRepository.findById(themeDto.getThemeId())
        .orElseThrow(() -> new CustomException(ErrorCode.THEME_NOT_FOUND));

    String existingOriginalFileName = themeDto.getOriginalFileName();
    String existingStoredFileName = theme.getStoredFileName();

    themeDto.setOriginalFileName(existingOriginalFileName);

    if (file != null && !file.isEmpty()) {
      try {
        // 이미지 중복 검사
        Criteria criteria = Criteria.where("originalFileName").is(existingOriginalFileName);
        Query query = new Query(criteria);

        Theme existingTheme = mongoTemplate.findOne(query, Theme.class);
        if (existingTheme != null && !existingTheme.getThemeId().equals(theme.getThemeId())) {
          throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 이미지가 이미 존재합니다.");
        }

        // 새로운 파일 저장
        String storedFileName = fileUtils.saveFile(file);
        themeDto.setStoredFileName(storedFileName);

        // 기존 파일 삭제
        if (existingStoredFileName != null) {
          boolean isDeleted = fileUtils.deleteFile(existingStoredFileName);
          if (!isDeleted) {
            throw new CustomException(ErrorCode.FILE_PROCESSING_ERROR);
          }
        }

      } catch (IOException e) {
        throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED, "파일 업로드 중 오류가 발생했습니다.");
      }
    } else {
      // 파일이 없는 경우 기존 이미지 유지
      themeDto.setStoredFileName(existingStoredFileName);
    }

    // 테마 이름과 설명에 대한 중복 검사
    Criteria nameAndDescriptionCriteria = new Criteria().orOperator(
        Criteria.where("themeName").is(themeDto.getThemeName()),
        Criteria.where("description").is(themeDto.getDescription()));
    Query nameAndDescriptionQuery = new Query(nameAndDescriptionCriteria);

    Theme existingThemeForNameAndDescription = mongoTemplate.findOne(nameAndDescriptionQuery, Theme.class);
    if (existingThemeForNameAndDescription != null &&
        !existingThemeForNameAndDescription.getThemeId().equals(theme.getThemeId())) {

      if (existingThemeForNameAndDescription.getThemeName().equals(themeDto.getThemeName())) {
        throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 테마 이름이 이미 존재합니다.");
      } else if (existingThemeForNameAndDescription.getDescription().equals(themeDto.getDescription())) {
        throw new CustomException(ErrorCode.DUPLICATE_ENTITY, "동일한 테마 설명이 이미 존재합니다.");
      }
    }

    // 기존 테마 정보를 업데이트하여 저장
    modelMapper.map(themeDto, theme);

    themeRepository.save(theme);

    ResponseDto<List<ThemeDto>> themeList = getAllTheme();
    themeList.setMsg("작성하신 테마 정보가 업데이트되었습니다.");

    return themeList;
  }

}
