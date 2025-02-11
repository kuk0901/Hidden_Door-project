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
