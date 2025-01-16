package com.baeksutalchul.hiddendoor.utils.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.baeksutalchul.hiddendoor.utils.random.RandomString;

import java.io.File;
import java.io.IOException;
import java.nio.file.DirectoryNotEmptyException;
import java.nio.file.NoSuchFileException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.HashMap;
import java.util.Map;

@Component("fileUtils")
public class FileUtils {

  private final String filePath; // 로컬 파일 저장 경로
  private final String defaultExtension; // 기본 파일 확장자

  private static final Logger logger = LoggerFactory.getLogger(FileUtils.class);

  public FileUtils(String filePath, String defaultExtension) {
    this.filePath = filePath;
    this.defaultExtension = defaultExtension;
    createDirectory();
  }

  private void createDirectory() {
    File directory = new File(filePath);
    if (!directory.exists()) {
      boolean created = directory.mkdirs();
      if (created) {
        logger.info("디렉토리가 성공적으로 생성되었습니다: {}", filePath);
      } else {
        logger.warn("디렉토리 생성 실패: {}", filePath);
      }
    } else {
      logger.info("디렉토리가 이미 존재합니다: {}", filePath);
    }
  }

  public Map<String, String> saveFile(MultipartFile file) throws IOException {
    Map<String, String> fileInfo = new HashMap<>();

    if (file != null && !file.isEmpty()) {
      String originalFileName = file.getOriginalFilename();
      String storedFileName = generateUniqueFileName(originalFileName);

      // 로컬 파일 시스템에 저장
      File localFile = new File(filePath, storedFileName);
      file.transferTo(localFile);

      fileInfo.put("originalFileName", originalFileName);
      fileInfo.put("storedFileName", storedFileName);
    }

    return fileInfo; // 저장된 파일 정보 반환
  }

  private String generateUniqueFileName(String originalFileName) {
    String baseName = RandomString.getRandomString();
    String extension = getFileExtension(originalFileName);
    return baseName + extension; // 고유한 파일 이름 생성
  }

  private String getFileExtension(String fileName) {
    if (fileName == null || fileName.isEmpty()) {
      return defaultExtension; // 기본 확장자 반환
    }

    int lastIndexOfDot = fileName.lastIndexOf(".");
    if (lastIndexOfDot == -1) {
      return defaultExtension; // 기본 확장자 반환
    }

    return fileName.substring(lastIndexOfDot).toLowerCase(); // 확장자 반환
  }

  public boolean deleteFile(String storedFileName) {
    Path pathToDelete = Paths.get(filePath, storedFileName);
    try {
      Files.delete(pathToDelete); // 파일 삭제
      logger.info("파일이 성공적으로 삭제되었습니다: {}", storedFileName);
      return true;
    } catch (NoSuchFileException e) {
      logger.warn("삭제할 파일이 존재하지 않습니다: {}", storedFileName);
      return false;
    } catch (DirectoryNotEmptyException e) {
      logger.error("디렉토리가 비어있지 않아 삭제할 수 없습니다: {}", storedFileName);
      return false;
    } catch (IOException e) {
      logger.error("파일 삭제 중 오류 발생: {}", e.getMessage());
      return false;
    }
  }
}
