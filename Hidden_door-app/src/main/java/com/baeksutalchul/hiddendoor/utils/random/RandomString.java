package com.baeksutalchul.hiddendoor.utils.random;

import java.util.UUID;

public class RandomString {

  private RandomString() {
  }
  
  public static String getRandomShortString() {
    return UUID.randomUUID().toString().replace("-", "").substring(0, 11);
  }


  public static String getRandomString() {
    return UUID.randomUUID().toString().replace("-", "");
  }
}
