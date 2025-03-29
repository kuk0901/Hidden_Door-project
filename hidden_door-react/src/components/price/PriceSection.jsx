import PriceItem from "@components/price/PriceItem";
import { toast } from "react-toastify";
import Api from "@axios/api";
import { useEffect, useState } from "react";

const PriceSection = () => {
  const [themePriceList, setThemePriceList] = useState([]);

  const findAllThemesWithPriceInfo = async () => {
    try {
      const res = await Api.get("/themes/summary-price");

      if (res.status !== 200) {
        toast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }

      setThemePriceList(res.data.data);
    } catch (error) {
      toast.error(
        error.message ??
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    findAllThemesWithPriceInfo();
  }, []);

  return (
    <section className="section section--price">
      <div className="section--title text-center bold">가격</div>
      <div className="price--line">
        <div className="price--guide">
          <div className="price"></div>
          <div className="price">1인</div>
          <div className="price">2인</div>
          <div className="price">3인</div>
          <div className="price">4인</div>
          <div className="price">5인</div>
          <div className="price">6인</div>
        </div>

        <ul className="price--list">
          <li className="price--item">
            {themePriceList.map((theme) => (
              <PriceItem key={theme.themeId} theme={theme} participants={0} />
            ))}
          </li>

          <li>
            <ul>
              {[1, 2, 3, 4, 5, 6].map((participants) => (
                <li key={participants} className="price--item">
                  {themePriceList.map((theme) => (
                    <PriceItem
                      key={theme.themeId}
                      theme={theme}
                      participants={participants}
                    />
                  ))}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default PriceSection;
