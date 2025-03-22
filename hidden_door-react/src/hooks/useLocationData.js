import { useQuery } from "react-query";
import { fetchLocationData } from "@utils/fetch/fetchLocationData";

/**
 * @description useLocationHook
 * @param {string} address - 위치 데이터를 조회할 주소
 * @returns {Object} useQuery의 반환 객체 (data, isLoading, isError 등 포함)
 */
export const useLocationData = (address) => {
  return useQuery(
    ["locationData", address], // 캐시 키
    () => fetchLocationData(address),
    {
      placeholderData: (previousData) => previousData
    }
  );
};
