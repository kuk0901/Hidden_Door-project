// 테마 이름 → HEX 색상 변환 함수
export const stringToColor = (str, minDiff = 30) => {
  const hash = Array.from(str).reduce(
    (acc, char) => (acc << 7) - acc + char.charCodeAt(0),
    5381
  );

  // 색조 분할 (12개 구역)
  const baseHue = (hash % 12) * 30; // 30도 간격
  const hueOffset = hash % minDiff; // 최소 차이 보장
  const hue = (baseHue + hueOffset) % 360;

  // 동적 채도/명도
  const saturation = 65 + (hash % 20); // 65-85%
  const lightness = 45 + (hash % 25); // 45-70%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
