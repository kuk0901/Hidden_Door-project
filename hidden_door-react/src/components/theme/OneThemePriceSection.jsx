import PriceItem from "@components/theme/PriceItem";

const OneThemePriceSection = ({ theme }) => {
  return (
    <section className="section section--price section--price--one">
      <div className="section--title text-center bold">가격</div>
      <div className="price--line">
        <div className="price--guide">
          <div className="price">1인</div>
          <div className="price">2인</div>
          <div className="price">3인</div>
          <div className="price">4인</div>
          <div className="price">5인</div>
          <div className="price">6인</div>
        </div>

        <ul className="price--list">
          {[1, 2, 3, 4, 5, 6].map((participants) => (
            <li key={participants} className="price--item">
              <PriceItem
                key={participants}
                theme={theme}
                participants={participants}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default OneThemePriceSection;
