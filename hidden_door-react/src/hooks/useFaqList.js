import { useRecoilState } from "recoil";
import { faqListAtom } from "@atoms/faqListAtom";

/**
 * @description useFaqList Hook
 * @returns {Object} faqList, setFaqList
 */
export const useFaqList = () => {
  const [faqList, setFaqList] = useRecoilState(faqListAtom);

  return {
    faqList,
    setFaqList,
  };
};
