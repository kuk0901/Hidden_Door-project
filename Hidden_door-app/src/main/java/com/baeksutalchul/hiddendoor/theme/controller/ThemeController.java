package com.baeksutalchul.hiddendoor.theme.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.theme.domain.Theme;
import com.baeksutalchul.hiddendoor.theme.service.ThemeService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/themes")
public class ThemeController {
  private ThemeService themeService;

  public ThemeController(ThemeService themeService) {
    this.themeService = themeService;
  }

  @GetMapping("/all")
  public ResponseEntity<ResponseDto<List<Theme>>> getAllTheme() {
    return ResponseEntity.ok().body(themeService.getAllTheme());
  }

  @GetMapping("/theme/{id}")
  public ResponseEntity<ResponseDto<Theme>> getThemeById(@PathVariable("id") String id) {
    return ResponseEntity.ok().body(themeService.getThemeById(id));
  }

}
