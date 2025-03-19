import { useEffect } from "react";
import { useThemeList } from "@hooks/useThemeList";
import Api from "@axios/api";
import { toast } from "react-toastify";

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
