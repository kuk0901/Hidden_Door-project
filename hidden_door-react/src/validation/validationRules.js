import {
  emailRegex,
  pwdRegex,
  priceRegex,
  phoneRegex,
  userNameRegex
} from "./regex";

// FIXME: 관리 계정 생성 비밀번호
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
      message: "대소문자 + 특수문자 + 숫자 포함 8글자 이상"
    }
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
    pattern: {
      value: phoneRegex,
      message: "유효한 휴대폰 번호 형식이 아닙니다."
    }
  },
  userName: {
    required: "이름은 필수입니다.",
    pattern: {
      value: userNameRegex,
      message: "한글 2~8자로 입력해주세요."
    }
  }
};

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
