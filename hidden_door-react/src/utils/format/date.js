/**
 * @description 날짜를 한국어 형식(YYYY.MM.DD)으로 포맷팅하는 함수
 * @param {string | number | Date} date - 포맷팅할 날짜 (Date 객체, 타임스탬프, 또는 날짜 문자열)
 * @returns {string} 포맷된 날짜 문자열 (예: "2025.03.23")
 */
export function formatKoreanDate(date) {
  return new Date(date)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ". ")
    .replace(/\.$/, "");
}

export function formatReservationSelectedDate(selectedDate) {
  const formattedDate = new Date(selectedDate);

  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formattedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
