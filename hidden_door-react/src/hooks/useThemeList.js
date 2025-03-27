import { useRecoilState } from "recoil";
import { themeListAtom } from "@atoms/themeListAtom";

/**
 * @description useThemeList Hook
 * @returns {Object} themeList, setThemeList
 * @deprecated 제거 예정
 */
export const useThemeList = () => {
  const [themeList, setThemeList] = useRecoilState(themeListAtom);

  return {
    themeList,
    setThemeList
  };
};
