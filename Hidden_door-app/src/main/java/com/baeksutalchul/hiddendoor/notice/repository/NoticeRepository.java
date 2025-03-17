package com.baeksutalchul.hiddendoor.notice.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.notice.domain.Notice;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

@Repository
public interface NoticeRepository extends MongoRepository<Notice, String> {
  Page<Notice> findAll(Pageable pageable);

    Page<Notice> findByTitleContaining(String title, Pageable pageable);

    Page<Notice> findByContentContaining(String content, Pageable pageable);

    Page<Notice> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
}
