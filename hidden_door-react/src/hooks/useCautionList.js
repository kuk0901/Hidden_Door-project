import { useRecoilState } from "recoil";
import { cautionListAtom } from "@atoms/cautionListAtom";

export const useCautionList = () => {
  const [cautionList, setCautionList] = useRecoilState(cautionListAtom);

  return {
    cautionList,
    setCautionList
  };
};
