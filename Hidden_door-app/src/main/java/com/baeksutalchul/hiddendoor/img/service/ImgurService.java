// package com.baeksutalchul.hiddendoor.img.service;

// import okhttp3.*;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
// import com.baeksutalchul.hiddendoor.error.exception.CustomException;
// import com.baeksutalchul.hiddendoor.utils.file.FileUtils;
// import com.baeksutalchul.hiddendoor.utils.file.FileValidationUtils;

// import java.io.IOException;
// import java.util.Map;

// // FIXME: 컬렉션 생성 후 이미지 필요한 컬렉션에 맞춰 코드 수정
// @Service
// public class ImgurService {

// @Value("${IMGUR_CLIENT_ID}")
// private String clientId;

// @Value("${IMGUR_API_URL}")
// private String imgurApiUrl;

// private final FileUtils fileUtils;
// private final FileValidationUtils fileValidationUtils;

// public ImgurService(FileUtils fileUtils, FileValidationUtils
// fileValidationUtils) {
// this.fileUtils = fileUtils; // 생성자에서 주입
// this.fileValidationUtils = fileValidationUtils; // 생성자에서 주입
// }

// public String uploadImage(MultipartFile file) {
// // 파일 검증
// fileValidationUtils.validateFileSize(file.getSize());
// fileValidationUtils.validateFileType(file.getOriginalFilename());

// try {
// // 이미지 파일을 로컬에 저장
// Map<String, String> savedFileInfo = fileUtils.saveFile(file);

// // Imgur에 이미지 업로드
// return uploadToImgur(file); // Imgur에 업로드하는 메서드 호출
// } catch (IOException e) {
// throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR); // IOException 발생
// 시 커스텀 예외 던지기
// }
// }

// public boolean deleteImage(String imageId) {
// OkHttpClient client = new OkHttpClient();

// Request request = new Request.Builder()
// .url("https://api.imgur.com/3/image/" + imageId) // 이미지 ID를 사용하여 URL 구성
// .delete() // DELETE 요청
// .addHeader("Authorization", "Client-ID " + clientId)
// .build();

// try (Response response = client.newCall(request).execute()) {
// if (!response.isSuccessful()) {
// throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
// }
// return true; // 삭제 성공 시 true 반환
// } catch (IOException e) {
// throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
// }
// }

// private String uploadToImgur(MultipartFile file) throws IOException {
// OkHttpClient client = new OkHttpClient();

// // 이미지 파일의 MIME 타입 결정
// String mimeType =
// fileValidationUtils.getMimeType(file.getOriginalFilename()); // 유틸리티 클래스에서
// MIME 타입 가져오기

// // 이미지 파일을 MultipartBody로 구성
// RequestBody requestBody = new MultipartBody.Builder()
// .setType(MultipartBody.FORM)
// .addFormDataPart("image", file.getOriginalFilename(),
// RequestBody.create(file.getBytes(), MediaType.parse(mimeType)))
// .build();

// Request request = new Request.Builder()
// .url(imgurApiUrl)
// .post(requestBody)
// .addHeader("Authorization", "Client-ID " + clientId)
// .build();

// try (Response response = client.newCall(request).execute()) {
// if (!response.isSuccessful()) {
// throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
// }

// // JSON 응답에서 이미지 URL 추출
// String jsonResponse = response.body().string();
// return extractImageUrl(jsonResponse); // URL 반환
// }
// }

// private String extractImageUrl(String jsonResponse) throws IOException {
// ObjectMapper objectMapper = new ObjectMapper();
// JsonNode rootNode = objectMapper.readTree(jsonResponse);

// if (!rootNode.path("data").isMissingNode()) {
// return rootNode.path("data").path("link").asText();
// } else {
// throw new CustomException(ErrorCode.INVALID_INPUT_FILE);
// }
// }
// }
