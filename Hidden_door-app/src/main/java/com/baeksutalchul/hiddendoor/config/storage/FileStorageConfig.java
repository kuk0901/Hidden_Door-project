package com.baeksutalchul.hiddendoor.config.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.baeksutalchul.hiddendoor.utils.file.FileUtils;

import java.io.File;

@Configuration
public class FileStorageConfig {

  @Value("${file.upload-dir}")
  private String uploadDir;

  @Value("${file.default-extension}")
  private String defaultExtension;

  @Bean
  public String filePath() {
    String os = System.getProperty("os.name").toLowerCase();
    String userHome = System.getProperty("user.home");

    // 운영체제에 따라 경로 설정
    if (os.contains("win")) {
      return "C:" + File.separator + uploadDir;
    } else if (os.contains("mac") || os.contains("nix") || os.contains("nux")) {
      return userHome + File.separator + uploadDir;
    } else {
      return userHome + File.separator + uploadDir; // 기본값
    }
  }

  @Bean
  public FileUtils fileUtils() {
    return new FileUtils(filePath(), defaultExtension);
  }
}
