package com.baeksutalchul.hiddendoor.admin.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.admin.domain.Admin;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {
  Optional<Admin> findByEmail(String email);

  Optional<Admin> findByToken(String token);

  boolean existsByEmail(String email);

  boolean existsByPhone(String phone);

  Optional<Admin> findById(String id);

  Page<Admin> findAll(Pageable pageable);

  Page<Admin> findByEmailContaining(String email, Pageable pageable);

  Page<Admin> findByUserNameContaining(String userName, Pageable pageable);

  Page<Admin> findByRolesContaining(String role, Pageable pageable);

  Page<Admin> findByEmailContainingOrUserNameContaining(String email, String userName, Pageable pageable);
}
