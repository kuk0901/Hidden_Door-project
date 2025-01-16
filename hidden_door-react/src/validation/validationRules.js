import { emailRegex, pwdRegex } from "./regex";

export const validationRules = {
  email: {
    required: "이메일은 필수입니다.",
    pattern: {
      value: emailRegex,
      message: "유효한 이메일 형식이 아닙니다."
    }
  },
  password: {
    required: "비밀번호는 필수입니다.",
    pattern: {
      value: pwdRegex,
      message: "대소문자, 특수문자를 포함하는 8글자 이상이어야 합니다."
    }
  }
};
