package com.baeksutalchul.hiddendoor.error.handler;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.error.res.ErrorResponse;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;
import com.baeksutalchul.hiddendoor.utils.page.PageableUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(CustomException.class)
  public ResponseEntity<ErrorResponse> handleCustomException(CustomException e, HttpServletRequest request) {
    ErrorCode errorCode = e.getErrorCode();
    PageDto page = extractPageable(request);

    ErrorResponse response = new ErrorResponse(
        errorCode.getHttpStatus().value(),
        errorCode.getCode(),
        e.getDetail(),
        page);

    HttpHeaders headers = new HttpHeaders();
    headers.add(HttpHeaders.CONTENT_TYPE, "application/json");

    return ResponseEntity.status(errorCode.getHttpStatus()).headers(headers).body(response);
  }

  @ExceptionHandler(NoHandlerFoundException.class)
  public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(NoHandlerFoundException e,
      HttpServletRequest request) {
    PageDto page = extractPageable(request);

    ErrorResponse response = new ErrorResponse(
        HttpStatus.NOT_FOUND.value(),
        "NOT_FOUND",
        "요청한 리소스를 찾을 수 없습니다.",
        page);

    HttpHeaders headers = new HttpHeaders();
    headers.add(HttpHeaders.CONTENT_TYPE, "application/json");

    return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers).body(response);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGlobalException(Exception e, HttpServletRequest request) {
    PageDto page = extractPageable(request);

    ErrorResponse response = new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "INTERNAL_SERVER_ERROR",
        "서버 오류가 발생했습니다.",
        page);

    HttpHeaders headers = new HttpHeaders();
    headers.add(HttpHeaders.CONTENT_TYPE, "application/json");

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).headers(headers).body(response);
  }

  public static PageDto extractPageable(HttpServletRequest request) {
    try {
      int page = Integer.parseInt(request.getParameter("page"));
      int size = Integer.parseInt(request.getParameter("size"));
      String sortField = request.getParameter("sortField");
      String sortDirection = request.getParameter("sortDirection");

      return new PageDto(
          page,
          size,
          0L, // totalElements
          0, // totalPages
          true, // isFirst
          true, // isLast
          sortField != null ? sortField : PageableUtil.DEFAULT_SORT_FIELD,
          sortDirection != null ? sortDirection : PageableUtil.DEFAULT_SORT_DIRECTION);
    } catch (NumberFormatException | NullPointerException e) {
      return new PageDto(); // 기본값으로 초기화
    }
  }

}
