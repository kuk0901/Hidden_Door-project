package com.baeksutalchul.hiddendoor.utils.format;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 날짜/시간 변환 유틸리티 클래스
 * KST(한국 표준시) 기반의 날짜 형식 변환 기능 제공
 */
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

  /**
   * Instant를 KST 기준 날짜 문자열(yyyy-MM-dd)로 변환
   * 
   * @param instant 변환할 시간 객체
   * @return 포맷된 날짜 문자열 (기본 시간인 경우 빈 문자열 반환)
   */
  public static String convertToKSTDate(Instant instant) {
    if (instant.equals(DEFAULT_INSTANT)) {
      return "";
    }

    ZonedDateTime kstZdt = ZonedDateTime.ofInstant(instant, KST_ZONE);
    return kstZdt.format(DATE_FORMATTER);
  }

  /**
   * Instant를 KST 기준 날짜/시간 문자열(yyyy-MM-dd HH:mm:ss)로 변환
   * 
   * @param instant 변환할 시간 객체
   * @return 포맷된 날짜/시간 문자열 (기본 시간인 경우 빈 문자열 반환)
   */
  public static String convertToKSTDateTime(Instant instant) {
    if (instant.equals(DEFAULT_INSTANT)) {
      return "";
    }

    ZonedDateTime kstZdt = ZonedDateTime.ofInstant(instant, KST_ZONE);
    return kstZdt.format(DATETIME_FORMATTER);
  }

  /**
   * Instant를 한글 날짜 문자열(yyyy년 MM월 dd일)로 변환
   * 
   * @param instant 변환할 시간 객체
   * @return 포맷된 한글 날짜 문자열 (기본 시간인 경우 빈 문자열 반환)
   */
  public static String convertToKoreanDate(Instant instant) {
    if (instant.equals(DEFAULT_INSTANT)) {
      return "";
    }

    ZonedDateTime kstZdt = ZonedDateTime.ofInstant(instant, KST_ZONE);
    return kstZdt.format(KOREAN_DATE_FORMATTER);
  }

  /**
   * Instant를 한글 날짜/시간 문자열(yyyy년 MM월 dd일 HH시간 mm분 ss초)로 변환
   * 
   * @param instant 변환할 시간 객체
   * @return 포맷된 한글 날짜/시간 문자열 (기본 시간인 경우 빈 문자열 반환)
   */
  public static String convertToKoreanDateTime(Instant instant) {
    if (instant.equals(DEFAULT_INSTANT)) {
      return "";
    }

    ZonedDateTime kstZdt = ZonedDateTime.ofInstant(instant, KST_ZONE);
    return kstZdt.format(KOREAN_DATETIME_FORMATTER);
  }
}
