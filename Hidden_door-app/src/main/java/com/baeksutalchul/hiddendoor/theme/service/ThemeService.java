package com.baeksutalchul.hiddendoor.theme.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.theme.domain.Theme;
import com.baeksutalchul.hiddendoor.theme.repository.ThemeRepository;

@Service
public class ThemeService {
  private ThemeRepository themeRepository;

  public ThemeService(ThemeRepository themeRepository) {
    this.themeRepository = themeRepository;
  }

  public ResponseDto<List<Theme>> getAllTheme() {
    List<Theme> themeList = themeRepository.findAll();
    if (themeList.isEmpty()) {
      throw new CustomException(ErrorCode.THEME_NOT_FOUND);
    }
    return new ResponseDto<>(themeList, "success");
  }

  public ResponseDto<Theme> getThemeById(String id) {
    Theme theme = themeRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.THEME_NOT_FOUND));
    return new ResponseDto<>(theme, "success");
  }
}
