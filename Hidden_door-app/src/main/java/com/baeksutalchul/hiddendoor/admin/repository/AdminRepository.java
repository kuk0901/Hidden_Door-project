package com.baeksutalchul.hiddendoor.admin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.baeksutalchul.hiddendoor.admin.domain.Admin;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {
  Optional<Admin> findByEmail(String email);

  boolean existsByEmail(String email);

  boolean existsByPhone(String phone);

  Optional<Admin> findById(String id);

  Page<Admin> findByEmailContainingOrUserNameContaining(String email, String userName, Pageable pageable);

  Page<Admin> findAllByOrderByRolesCountDesc(Pageable pageable);

  Page<Admin> findByEmailContainingOrderByRolesCountDesc(String email, Pageable pageable);

  Page<Admin> findByUserNameContainingOrderByRolesCountDesc(String userName, Pageable pageable);

  Page<Admin> findByRolesContainingOrderByRolesCountDesc(String role, Pageable pageable);
}
