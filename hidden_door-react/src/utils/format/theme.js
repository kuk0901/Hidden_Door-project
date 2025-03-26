import { formatNumberToPrice } from "@utils/format/number";

/**
 * @description 테마 필드의 값을 형식에 맞게 포맷팅하는 함수
 * @param {string} field - 포맷팅할 필드 이름
 * @param {string|number} value - 포맷팅할 값
 * @returns {string} 포맷팅된 문자열
 */
export const formatThemeFieldContent = (field, value) => {
  switch (field) {
    case "minParticipants":
    case "maxParticipants":
      return `${value}명`;
    case "time":
      return `${value}(분)`;
    case "price":
      return `${formatNumberToPrice(value)}(원)`;
    default:
      return value;
  }
};
