package com.baeksutalchul.hiddendoor.utils.file;

import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import org.springframework.stereotype.Component;

@Component
public class FileValidationUtils {

  private static final long MAX_FILE_SIZE = 5L * 1024 * 1024; // 5MB

  public void validateFileSize(long fileSize) {
    if (fileSize > MAX_FILE_SIZE) {
      throw new CustomException(ErrorCode.FILE_SIZE_EXCEEDED);
    }
  }

  public void validateFileType(String filename) {
    String extension = getFileExtension(filename);
    if (!isValidImageExtension(extension)) {
      throw new CustomException(ErrorCode.INVALID_INPUT_FILE);
    }
  }

  private boolean isValidImageExtension(String extension) {
    return extension.equalsIgnoreCase("jpg") ||
        extension.equalsIgnoreCase("jpeg") ||
        extension.equalsIgnoreCase("png") ||
        extension.equalsIgnoreCase("gif");
  }

  private String getFileExtension(String filename) {
    int lastIndexOfDot = filename.lastIndexOf('.');
    return (lastIndexOfDot == -1) ? "" : filename.substring(lastIndexOfDot + 1);
  }

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
