import PriceItem from "@components/theme/PriceItem";
import { useThemeList } from "@hooks/useThemeList";

const PriceSection = () => {
  const { themeList } = useThemeList();

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
            {themeList.map((theme) => (
              <PriceItem key={theme.themeId} theme={theme} participants={0} />
            ))}
          </li>

          <li>
            <ul>
              {[1, 2, 3, 4, 5, 6].map((participants) => (
                <li key={participants} className="price--item">
                  {themeList.map((theme) => (
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
