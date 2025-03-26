import { useEffect } from "react";
import { useThemeList } from "@hooks/useThemeList";
import Api from "@axios/api";
import { toast } from "react-toastify";

/**
 * @description 모든 테마 데이터를 가져옴
 * @returns {Object} themeList - 테마 리스트 데이터
 */
export function useThemes() {
  const { themeList, setThemeList } = useThemeList();

  const getAllThemes = async () => {
    try {
      const res = await Api.get("/themes/all");

      setThemeList(res.data.data);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    getAllThemes();
  }, [setThemeList]);

  return { themeList };
}
