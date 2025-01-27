import { useRecoilState } from "recoil";
import { themeListAtom } from "@atoms/themeListAtom";

export const useThemeList = () => {
  const [themeList, setThemeList] = useRecoilState(themeListAtom);

  return {
    themeList,
    setThemeList
  };
};
