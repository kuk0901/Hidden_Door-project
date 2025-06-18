package com.baeksutalchul.hiddendoor.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordCheckDto {
    private String customerId;
    private int password;
}
