package com.baeksutalchul.hiddendoor.theme.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.theme.domain.Theme;

@Repository
public interface ThemeRepository extends MongoRepository<Theme, String> {
  List<Theme> findAll();

  Optional<Theme> findById(String id);

  Optional<Theme> findByThemeName(String themeName);
}
