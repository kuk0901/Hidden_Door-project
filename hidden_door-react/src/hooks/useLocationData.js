import { useQuery } from "react-query";
import { fetchLocationData } from "@utils/fetch/fetchLocationData";

export const useLocationData = (address) => {
  return useQuery(
    ["locationData", address], // 캐시 키
    () => fetchLocationData(address)
  );
};
