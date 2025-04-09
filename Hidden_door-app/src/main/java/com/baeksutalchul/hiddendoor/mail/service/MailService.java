package com.baeksutalchul.hiddendoor.mail.service;

import org.springframework.stereotype.Component;

import com.baeksutalchul.hiddendoor.mail.dto.MailDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Component
public class MailService {
  private final JavaMailSender javaMailSender;
  private static final Logger logger = LoggerFactory.getLogger(MailService.class);

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

    logger.info("simpleMailMessage:{}", simpleMailMessage);

    javaMailSender.send(simpleMailMessage);
  }
}