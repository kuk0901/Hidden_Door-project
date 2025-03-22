/**
 * @description 숫자를 천 단위로 쉼표가 있는 가격 형식으로 변환하는 함수
 * @param {number} number - 변환할 숫자
 * @returns {string} 천 단위로 쉼표가 포함된 문자열
 */
export const formatNumberToPrice = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * @description 전화번호를 한국 형식(000-0000-0000)으로 포맷팅하는 함수
 * @param {string} value - 포맷팅할 전화번호 문자열
 * @returns {string} 포맷팅된 전화번호 문자열
 */
export const formatPhoneNumber = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
    3,
    7
  )}-${phoneNumber.slice(7, 11)}`;
};
