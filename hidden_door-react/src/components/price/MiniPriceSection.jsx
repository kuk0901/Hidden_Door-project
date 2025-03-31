import Api from "@axios/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MiniPriceItem from "@components/price/MiniPriceItem";

const MiniPriceSection = () => {
  const [themeList, setThemeList] = useState([]);

  const getSummeryThemeList = async () => {
    try {
      const res = await Api.get("/themes/summary");

      if (res.status !== 200) {
        toast.error(
          "테마 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        );
      }

      setThemeList(res.data.data);
    } catch (error) {
      toast.error(
        error.message ??
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    getSummeryThemeList();
  }, []);

  return (
    <section className="section section--price--mini">
      <div className="section--title text-center bold">가격</div>

      {themeList.map((theme) => (
        <MiniPriceItem key={theme.themeId} theme={theme} />
      ))}
    </section>
  );
};

export default MiniPriceSection;
