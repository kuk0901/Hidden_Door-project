package com.baeksutalchul.hiddendoor.admin.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.baeksutalchul.hiddendoor.admin.service.AdminService;
import com.baeksutalchul.hiddendoor.dto.AdminDeleteRequestDto;
import com.baeksutalchul.hiddendoor.dto.AdminDto;
import com.baeksutalchul.hiddendoor.res.ResponseDto;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/admins")
public class AdminController {
  private AdminService adminService;

  public AdminController(AdminService adminService) {
    this.adminService = adminService;
  }

  @GetMapping("/all")
  public ResponseEntity<ResponseDto<List<AdminDto>>> getAllAdmin(
      @RequestParam(required = false, defaultValue = "1") int page,
      @RequestParam(required = false, defaultValue = "10") int size,
      @RequestParam(required = false, defaultValue = "id") String sortField,
      @RequestParam(required = false, defaultValue = "ASC") String sortDirection,
      @RequestParam(required = false) String searchField,
      @RequestParam(required = false) String searchTerm) {

    PageDto pageDto = new PageDto(
        page,
        size,
        0L,
        0,
        page == 1,
        false,
        sortField,
        sortDirection);
    return ResponseEntity.ok().body(adminService.getAllAdmin(pageDto, searchField, searchTerm));
  }

  @GetMapping("/account/{id}")
  public ResponseEntity<ResponseDto<AdminDto>> getAdminInfo(@PathVariable("id") String id) {
    return ResponseEntity.ok().body(adminService.getAdminInfo(id));
  }

  @DeleteMapping("/account/delete/one")
  public ResponseEntity<ResponseDto<List<AdminDto>>> deleteAdminOne(@RequestBody AdminDeleteRequestDto requestDto) {
    return ResponseEntity.ok().body(adminService.deleteAdminOne(requestDto));
  }

}
