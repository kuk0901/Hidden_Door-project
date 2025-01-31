package com.baeksutalchul.hiddendoor.error.exception;

import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;

public class CustomException extends RuntimeException {
  private final ErrorCode errorCode;
  private final String detail;

  public CustomException(ErrorCode errorCode) {
    super(errorCode.getMsg());
    this.errorCode = errorCode;
    this.detail = errorCode.getMsg();
  }

  public CustomException(ErrorCode errorCode, String detail) {
    super(detail);
    this.errorCode = errorCode;
    this.detail = detail;
  }

  public ErrorCode getErrorCode() {
    return errorCode;
  }

  public String getDetail() {
    return detail;
  }
}
