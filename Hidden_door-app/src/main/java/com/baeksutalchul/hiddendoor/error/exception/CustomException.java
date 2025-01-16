package com.baeksutalchul.hiddendoor.error.exception;

import com.baeksutalchul.hiddendoor.error.enums.ErrorCode;

public class CustomException extends RuntimeException {
  private final ErrorCode errorCode;

  public CustomException(ErrorCode errorCode) {
    super(errorCode.getMsg());
    this.errorCode = errorCode;
  }

  public ErrorCode getErrorCode() {
    return errorCode;
  }
}
