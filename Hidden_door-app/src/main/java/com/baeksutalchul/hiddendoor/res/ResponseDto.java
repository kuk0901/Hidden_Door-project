package com.baeksutalchul.hiddendoor.res;

import com.baeksutalchul.hiddendoor.utils.page.PageDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto<T> {
  private String token;
  private T data;
  private String msg;
  private PageDto page;

  public ResponseDto(String token) {
    this.token = token;
    this.page = new PageDto(0, 0, token, false);
  }

  public ResponseDto(T data, String msg) {
    this.data = data;
    this.msg = msg;
    this.page = new PageDto(0, 0, token, false);
  }

  public ResponseDto(String token, T data, String msg) {
    this.token = token;
    this.data = data;
    this.msg = msg;
    this.page = new PageDto(0, 0, token, false);
  }
}
