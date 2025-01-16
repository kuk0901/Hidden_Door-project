// package com.baeksutalchul.hiddendoor.img.controller;

// import com.baeksutalchul.hiddendoor.img.service.ImgurService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// @RestController
// @RequestMapping("/api/images")
// public class ImageController {

// private final ImgurService imgurService;

// public ImageController(ImgurService imgurService) {
// this.imgurService = imgurService;
// }

// @PostMapping("/upload")
// public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile
// file) {
// String imageUrl = imgurService.uploadImage(file); // 예외가 발생하면
// GlobalExceptionHandler에서 처리됨
// return ResponseEntity.ok(imageUrl); // 성공적으로 업로드된 이미지 URL 반환
// }
// }
