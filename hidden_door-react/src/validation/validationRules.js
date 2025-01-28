import { emailRegex, pwdRegex, priceRegex } from "./regex";

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

export const themeValidationRules = {
  originalFileName: {
    required: true,
    message: "이미지를 선택해주세요"
  },
  minParticipants: {
    required: true,
    min: 2,
    max: 3,
    message: "최소 인원은 1~3명 사이여야 합니다"
  },
  maxParticipants: {
    required: true,
    min: 4,
    max: 6,
    message: "최대 인원은 4~6명 사이여야 합니다"
  },
  level: {
    required: true,
    min: 1,
    max: 5,
    message: "난이도는 1~5 사이여야 합니다"
  },
  time: {
    required: true,
    min: 30,
    max: 180,
    message: "플레이 시간은 30~180분 사이여야 합니다"
  },
  price: {
    required: true,
    pattern: priceRegex,
    message: "올바른 가격 형식을 입력해주세요 (예: 20,000)"
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: "설명은 10~500자 사이여야 합니다"
  }
};

export const validateThemeField = (name, value) => {
  const rules = themeValidationRules[name];
  if (!rules) return "";

  if (rules.required && !value) {
    return rules.message;
  }

  if (rules.min && value < rules.min) {
    return rules.message;
  }

  if (rules.max && value > rules.max) {
    return rules.message;
  }

  if (rules.minLength && value.length < rules.minLength) {
    return rules.message;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return rules.message;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message;
  }

  return "";
};
