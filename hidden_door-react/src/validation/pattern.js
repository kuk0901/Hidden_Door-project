import {
  pwdRegex,
  emailRegex,
  phoneRegex,
  userNameRegex
} from "@validation/regex";

export const passwordPattern = {
  value: pwdRegex,
  message: "대소문자 + 특수문자 + 숫자 포함 8글자 이상"
};

export const emailPattern = {
  value: emailRegex,
  message: "유효한 이메일 형식이 아닙니다."
};

export const phonePattern = {
  value: phoneRegex,
  message: "유효한 휴대폰 번호 형식이 아닙니다."
};

export const userNamePattern = {
  value: userNameRegex,
  message: "한글 2~8자로 입력해주세요.(공백불가)"
};
