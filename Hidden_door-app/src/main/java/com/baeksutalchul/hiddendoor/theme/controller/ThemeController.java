package com.baeksutalchul.hiddendoor.theme.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.baeksutalchul.hiddendoor.dto.ThemeDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.theme.domain.Theme;
import com.baeksutalchul.hiddendoor.theme.service.ThemeService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1/themes")
public class ThemeController {
  private ThemeService themeService;

  public ThemeController(ThemeService themeService) {
    this.themeService = themeService;
  }

  @GetMapping("/all")
  public ResponseEntity<ResponseDto<List<ThemeDto>>> getAllTheme() {
    return ResponseEntity.ok().body(themeService.getAllTheme());
  }

  @GetMapping("/theme/{id}")
  public ResponseEntity<ResponseDto<Theme>> getThemeById(@PathVariable("id") String id) {
    return ResponseEntity.ok().body(themeService.getThemeById(id));
  }

  @PostMapping("/theme/add")
  public ResponseEntity<ResponseDto<List<ThemeDto>>> addThemeOne(@RequestPart("themeDto") ThemeDto themeDto,
      @RequestPart("file") MultipartFile file) {
    return ResponseEntity.ok().body(themeService.addThemeWithFile(themeDto,
        file));

  }

  @PutMapping("/theme/update/{id}")
  public ResponseEntity<ResponseDto<List<ThemeDto>>> updateThemeOne(
      @PathVariable("id") String id,
      @RequestPart("themeDto") ThemeDto themeDto, @RequestPart(value = "file", required = false) MultipartFile file) {
    return ResponseEntity.ok().body(themeService.updateThemeWithFile(id, themeDto,
        file));
  }

  @DeleteMapping("/theme/delete/{id}")
  public ResponseEntity<ResponseDto<List<ThemeDto>>> deleteThemeOne(@PathVariable("id") String id) {
    return ResponseEntity.ok().body(themeService.deleteThemeOne(id));
  }

}
