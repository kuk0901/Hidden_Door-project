package com.baeksutalchul.hiddendoor.theme.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.theme.domain.Theme;

@Repository
public interface ThemeRepository extends MongoRepository<Theme, String> {
  List<Theme> findAll();

  Optional<Theme> findById(String id);

  Optional<Theme> findByThemeName(String themeName);

  Optional<Theme> findByOriginalFileName(String originalFileName);

  Optional<Theme> findByDescription(String description);

  void deleteById(String id);

  @Query(value = "{}", fields = "{ 'themeId': 1, 'storedFileName': 1, 'themeName': 1 }")
  List<Theme> findAllThemesSummary();

  @Query(value = "{}", fields = "{ 'themeId': 1, 'themeName': 1, 'minParticipants': 1, 'maxParticipants': 1, 'price': 1 }")
  List<Theme> findAllThemesWithPriceInfo();

  List<Theme> findByThemeNameContaining(String themeName);
}
