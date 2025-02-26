package com.baeksutalchul.hiddendoor.error.res;

import com.baeksutalchul.hiddendoor.utils.page.PageDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
  private final int status;
  private final String errorCode;
  private final String msg;
  private final PageDto page;

  public ErrorResponse(int status, String errorCode, String msg) {
    this(status, errorCode, msg, new PageDto());
  }

}
