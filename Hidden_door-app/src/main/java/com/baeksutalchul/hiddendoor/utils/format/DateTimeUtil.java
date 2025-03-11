package com.baeksutalchul.hiddendoor.utils.format;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtil {
  private static final Instant DEFAULT_INSTANT = Instant.parse("1970-01-01T00:00:00Z");
  private static final ZoneId KST_ZONE = ZoneId.of("Asia/Seoul");
  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
  private static final DateTimeFormatter KOREAN_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
  private static final DateTimeFormatter KOREAN_DATETIME_FORMATTER = DateTimeFormatter
      .ofPattern("yyyy년 MM월 dd일 HH시간 mm분 ss초");

  private DateTimeUtil() {
  }

  public static String convertToKSTDate(Instant instant) {
    if (instant.equals(DEFAULT_INSTANT)) {
      return "";
    }

    ZonedDateTime kstZdt = ZonedDateTime.ofInstant(instant, KST_ZONE);
    return kstZdt.format(DATE_FORMATTER);
  }

  public static String convertToKSTDateTime(Instant instant) {
    if (instant.equals(DEFAULT_INSTANT)) {
      return "";
    }

    ZonedDateTime kstZdt = ZonedDateTime.ofInstant(instant, KST_ZONE);
    return kstZdt.format(DATETIME_FORMATTER);
  }

  public static String convertToKoreanDate(Instant instant) {
    if (instant.equals(DEFAULT_INSTANT)) {
      return "";
    }

    ZonedDateTime kstZdt = ZonedDateTime.ofInstant(instant, KST_ZONE);
    return kstZdt.format(KOREAN_DATE_FORMATTER);
  }

  public static String convertToKoreanDateTime(Instant instant) {
    if (instant.equals(DEFAULT_INSTANT)) {
      return "";
    }

    ZonedDateTime kstZdt = ZonedDateTime.ofInstant(instant, KST_ZONE);
    return kstZdt.format(KOREAN_DATETIME_FORMATTER);
  }
}
