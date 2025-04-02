package com.baeksutalchul.mail.service;

import org.springframework.stereotype.Component;

import com.baeksutalchul.mail.dto.MailDto;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

// FIXME: 예악 후 이메일 전송 처리
@Component
public class MailService {
  private final JavaMailSender javaMailSender;

  @Value("${spring.mail.username}")
  private String username;

  public MailService(JavaMailSender javaMailSender) {
    this.javaMailSender = javaMailSender;
  }

  public void sendMail(MailDto mailDto) {
    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
    simpleMailMessage.setTo(mailDto.getAddress());
    simpleMailMessage.setFrom("Hidden_door <" + username + ">");
    simpleMailMessage.setSubject(mailDto.getTitle());
    simpleMailMessage.setText(mailDto.getMessage());

    javaMailSender.send(simpleMailMessage);
  }
}

/*
 * 
 * // 예약 완료된 후에 이메일로 예약번호 전송
 * try {
 * String message = String.format(
 * "안녕하세요, %s님!\n\n" +
 * "예약이 성공적으로 완료되었습니다.\n\n" +
 * "예약 번호: %s\n" +
 * "예약 날짜: %s\n" +
 * "예약 시간: %s\n\n" +
 * "감사합니다.",
 * db저장.getName(),
 * db저장.getReservationNumber(),
 * dto || db저장.getReservationDate(),
 * dto || db저장.getReservationTime()
 * );
 * 
 * MailDto mailDto = new MailDto(saved.getEmail(), message); -> title은 기본값 설정해 둠
 * mailService.sendMail(mailDto);
 * 
 * } catch (Exception e) {
 * // 예약 이메일 전송 실패 관련 ErrorCode 생성 후 사용
 * }
 * 
 * 
 * 
 */
