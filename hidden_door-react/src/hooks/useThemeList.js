import { useRecoilState } from "recoil";
import { themeListAtom } from "@atoms/themeListAtom";

/**
 * @description useThemeList Hook
 * @returns {Object} themeList, setThemeList
 */
export const useThemeList = () => {
  const [themeList, setThemeList] = useRecoilState(themeListAtom);

  return {
    themeList,
    setThemeList
  };
};
