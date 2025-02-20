package com.baeksutalchul.hiddendoor.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.admin.service.AdminService;
import com.baeksutalchul.hiddendoor.dto.AdminDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/admins")
public class AdminController {
  private AdminService adminService;

  public AdminController(AdminService adminService) {
    this.adminService = adminService;
  }

  // FIXME: PageableUtil 사용 코드로 변경 필요
  @GetMapping("/all")
  public ResponseEntity<ResponseDto<List<AdminDto>>> getAllAdmin(@RequestBody(required = false) PageDto pageDto,
      @RequestBody(required = false) String search) {

    return ResponseEntity.ok().body(adminService.getAllAdmin(pageDto, search));
  }

}
