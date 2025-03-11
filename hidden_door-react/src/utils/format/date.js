export function formatKoreanDate(date) {
  return new Date(date)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\. /g, '. ')
    .replace(/\.$/, '');
}
