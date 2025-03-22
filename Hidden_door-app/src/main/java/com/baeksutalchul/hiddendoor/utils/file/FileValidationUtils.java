package com.baeksutalchul.hiddendoor.utils.file;

import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import org.springframework.stereotype.Component;

// 현재 미사용
@Component
public class FileValidationUtils {

  private static final long MAX_FILE_SIZE = 5L * 1024 * 1024; // 5MB

  /**
   * 파일 크기를 검증
   * 
   * @param fileSize 검증할 파일 크기 (바이트)
   * @throws CustomException 파일 크기가 최대 허용 크기를 초과할 경우
   */
  public void validateFileSize(long fileSize) {
    if (fileSize > MAX_FILE_SIZE) {
      throw new CustomException(ErrorCode.FILE_SIZE_EXCEEDED);
    }
  }

  /**
   * 파일 크기를 검증
   * 
   * @param fileSize 검증할 파일 크기 (바이트)
   * @throws CustomException 파일 크기가 최대 허용 크기를 초과할 경우
   */
  public void validateFileType(String filename) {
    String extension = getFileExtension(filename);
    if (!isValidImageExtension(extension)) {
      throw new CustomException(ErrorCode.INVALID_INPUT_FILE);
    }
  }

  /**
   * 이미지 파일 확장자의 유효성을 검사
   * 
   * @param extension 검사할 파일 확장자
   * @return 유효한 이미지 확장자인 경우 true, 그렇지 않으면 false
   */
  private boolean isValidImageExtension(String extension) {
    return extension.equalsIgnoreCase("jpg") ||
        extension.equalsIgnoreCase("jpeg") ||
        extension.equalsIgnoreCase("png") ||
        extension.equalsIgnoreCase("gif");
  }

  /**
   * 파일명에서 확장자를 추출
   * 
   * @param filename 확장자를 추출할 파일명
   * @return 파일 확장자 (없는 경우 빈 문자열)
   */
  private String getFileExtension(String filename) {
    int lastIndexOfDot = filename.lastIndexOf('.');
    return (lastIndexOfDot == -1) ? "" : filename.substring(lastIndexOfDot + 1);
  }

  /**
   * 파일명에 기반하여 MIME 타입을 결정
   * (MIME 타입은 파일의 형식을 나타내는 표준화된 방식)
   * 
   * @param filename MIME 타입을 결정할 파일명
   * @return 결정된 MIME 타입
   */
  public String getMimeType(String filename) {
    if (filename.endsWith(".png")) {
      return "image/png";
    } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
      return "image/jpeg";
    } else if (filename.endsWith(".gif")) {
      return "image/gif";
    }
    return "application/octet-stream"; // 기본 MIME 타입
  }
}
