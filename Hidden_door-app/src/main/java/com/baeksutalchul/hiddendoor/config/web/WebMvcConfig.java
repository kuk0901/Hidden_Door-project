package com.baeksutalchul.hiddendoor.config.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
  @Value("${file.upload-dir}")
  private String uploadDir;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String os = System.getProperty("os.name").toLowerCase();
    String userHome = System.getProperty("user.home");
    String fullPath;

    // 운영체제에 따라 경로 설정
    if (os.contains("win")) {
      fullPath = "file:C:" + File.separator + uploadDir + "/";
    } else if (os.contains("mac") || os.contains("nix") || os.contains("nux")) {
      fullPath = "file:" + userHome + File.separator + uploadDir + "/";
    } else {
      fullPath = "file:" + userHome + File.separator + uploadDir + "/";
    }

    // 이미지 리소스 핸들러
    registry.addResourceHandler("/images/**")
        .addResourceLocations(fullPath);
  }
}
