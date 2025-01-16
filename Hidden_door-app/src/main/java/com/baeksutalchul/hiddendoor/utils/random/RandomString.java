package com.baeksutalchul.hiddendoor.utils.random;

import java.util.UUID;

public class RandomString {
  public static String getRandomString() {
    return UUID.randomUUID().toString().replace("-", "");
  }
}
