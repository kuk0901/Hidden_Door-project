package com.baeksutalchul.hiddendoor.error.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;
import com.baeksutalchul.hiddendoor.error.exception.CustomException;
import com.baeksutalchul.hiddendoor.error.res.ErrorResponse;
import com.baeksutalchul.hiddendoor.utils.page.PageDto;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(CustomException.class)
  public ResponseEntity<ErrorResponse> handleCustomException(CustomException e, HttpServletRequest request) {
    ErrorCode errorCode = e.getErrorCode();
    PageDto page = extractPageable(request);

    ErrorResponse response = new ErrorResponse(
        errorCode.getHttpStatus().value(),
        errorCode.getCode(),
        errorCode.getMsg(),
        page);

    logger.info("ErrorResponse: {}", response);

    return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
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

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGlobalException(Exception e, HttpServletRequest request) {
    PageDto page = extractPageable(request);

    ErrorResponse response = new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "INTERNAL_SERVER_ERROR",
        "서버 오류가 발생했습니다.",
        page);

    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }

  private PageDto extractPageable(HttpServletRequest request) {
    try {
      int page = Integer.parseInt(request.getParameter("page"));
      int size = Integer.parseInt(request.getParameter("size"));
      String sortField = request.getParameter("sortField");
      boolean isAsc = Boolean.parseBoolean(request.getParameter("isAsc"));

      return new PageDto(page, size, sortField, isAsc);
    } catch (NumberFormatException | NullPointerException e) {
      return new PageDto(1, 10, "id", true); // 기본값으로 초기화
    }
  }

}
