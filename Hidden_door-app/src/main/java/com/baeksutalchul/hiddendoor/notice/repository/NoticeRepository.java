package com.baeksutalchul.hiddendoor.notice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.notice.domain.Notice;

@Repository
public interface NoticeRepository extends MongoRepository<Notice, String> {
}
