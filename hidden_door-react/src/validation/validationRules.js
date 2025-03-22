import { priceRegex } from "@validation/regex";

import {
  emailPattern,
  passwordPattern,
  phonePattern,
  userNamePattern
} from "@validation/pattern";

export const validationRules = {
  email: {
    required: "이메일은 필수입니다.",
    pattern: emailPattern
  },
  pwd: {
    required: "비밀번호는 필수입니다.",
    pattern: passwordPattern
  },
  optionalPwd: {
    pattern: passwordPattern
  },
  title: {
    required: "주의사항 제목은 필수입니다.",
    maxLength: {
      value: 30,
      message: "제목은 30자 이내로 입력해주세요."
    }
  },
  content: {
    required: "주의사항 내용은 필수입니다.",
    maxLength: {
      value: 500,
      message: "내용은 500자 이내로 입력해주세요."
    }
  },
  phone: {
    required: "휴대폰 번호는 필수입니다.",
    pattern: phonePattern
  },
  userName: {
    required: "이름은 필수입니다.",
    pattern: userNamePattern
  }
};

/**
 * @description 테마 필드에 대한 유효성 검사 규칙을 정의하는 함수
 * @param {Object|null} theme - 현재 테마 객체 (없으면 null)
 * @returns {Object} 각 필드별 유효성 검사 규칙
 */
export const themeValidationRules = (theme = null) => {
  const rules = {
    originalFileName: {
      required: !theme, // 추가하는 경우에는 필수 입력
      message: "이미지를 선택해주세요"
    },
    themeName: {
      required: true,
      message: "최대 30자 이내여야 합니다."
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
  return rules;
};

/**
 * @description 특정 테마 필드의 값을 검증하는 함수
 * @param {string} name - 필드 이름
 * @param {*} value - 필드 값
 * @param {Object|null} theme - 현재 테마 객체 (없으면 null)
 * @returns {string} 유효성 검사 결과 메시지 (오류가 없으면 빈 문자열)
 */
export const validateThemeField = (name, value, theme = null) => {
  const rules = themeValidationRules(theme)[name];
  if (!rules) return "";

  if (rules.required && !value) {
    if (name === "originalFileName") {
      return "이미지를 선택해주세요";
    }
    return "필수 입력란입니다.";
  }

  if (name === "themeName") {
    if (value.length > 30) {
      return "테마 이름은 최대 30자 이내여야 합니다.";
    }
    return "";
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
