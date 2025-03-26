package com.baeksutalchul.hiddendoor.config.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.IOException;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
  @Value("${file.upload-dir}")
  private String uploadDir;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 1. OS 종속적 경로 생성 (조건문 제거)
    String osSpecificPath = "file:" + System.getProperty("user.home")
        + File.separator + uploadDir + File.separator;

    // 2. 디렉토리 생성 로직 추가
    File uploadFolder = new File(System.getProperty("user.home"), uploadDir);
    uploadFolder.mkdirs();

    // 3. 리소스 핸들러 설정
    registry.addResourceHandler("/images/**")
        .addResourceLocations(osSpecificPath);

    // 4. 기타 정적 리소스 설정
    registry.addResourceHandler("/**")
        .addResourceLocations("classpath:/static/")
        .resourceChain(true)
        .addResolver(new PathResourceResolver() {
          @Override
          protected Resource getResource(String resourcePath, Resource location) throws IOException {
            Resource requestedResource = location.createRelative(resourcePath);
            return requestedResource.exists() && requestedResource.isReadable()
                ? requestedResource
                : new ClassPathResource("/static/index.html");
          }
        });
  }
}
