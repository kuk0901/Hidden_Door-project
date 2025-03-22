/**
 * @description 카카오 API를 사용하여 주소에 해당하는 위도, 경도 정보를 가져오는 함수
 * @param {string} address - 주소
 * @returns {Promise<{x: string, y: string}>} 위도(x)와 경도(y) 정보를 담은 객체
 * @throws {Error} 주소를 찾을 수 없는 경우 "Address not found" 에러 발생
 */
export const fetchLocationData = async (address) => {
  const encodedAddress = encodeURIComponent(address);

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`,
    {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_API}`
      }
    }
  );
  const data = await response.json();

  // 응답 데이터에서 위도와 경도를 추출
  const { documents } = data;
  if (documents.length > 0) {
    const { x, y } = documents[0].address;
    return { x, y };
  } else {
    throw new Error("Address not found");
  }
};
