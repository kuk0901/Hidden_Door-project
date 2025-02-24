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
  private PageDto pageDto;
  private String searchField; // select option
  private String searchTerm; // input value

  public ResponseDto(String token) {
    this.token = token;
    this.pageDto = new PageDto();
  }

  public ResponseDto(T data, String msg) {
    this.data = data;
    this.msg = msg;
    this.pageDto = new PageDto();
  }

  public ResponseDto(String token, T data, String msg) {
    this.token = token;
    this.data = data;
    this.msg = msg;
    this.pageDto = new PageDto();
  }

  public ResponseDto(T data, String msg, String searchField, String searchTerm) {
    this.data = data;
    this.msg = msg;
    this.pageDto = new PageDto();
    this.searchField = searchField;
    this.searchTerm = searchTerm;
  }

  public ResponseDto(T data, String msg, PageDto pageDto, String searchField, String searchTerm) {
    this.data = data;
    this.msg = msg;
    this.pageDto = pageDto;
    this.searchField = searchField;
    this.searchTerm = searchTerm;
  }
}
