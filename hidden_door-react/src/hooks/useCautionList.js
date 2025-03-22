import { useRecoilState } from "recoil";
import { cautionListAtom } from "@atoms/cautionListAtom";

/**
 * @description useCautionList Hook
 * @returns {Object} cautionList, setCautionList
 */
export const useCautionList = () => {
  const [cautionList, setCautionList] = useRecoilState(cautionListAtom);

  return {
    cautionList,
    setCautionList
  };
};
