import { formatNumberToPrice } from "@utils/format/number";

const participants = [1, 2, 3, 4, 5, 6];

const MiniPriceItem = ({ theme }) => {
  const renderPrice = participants.map((participant) => {
    if (
      participant < theme.minParticipants ||
      participant > theme.maxParticipants
    ) {
      return "-";
    }
    return formatNumberToPrice(theme.price * participant);
  });

  return (
    <div className="price--line">
      <div className="price--title text-center bold">
        {theme.themeName}
        <span>({theme.time}분)</span>
      </div>

      <div className="price--content">
        <ul className="price--guide--list">
          {participants.map((participant) => (
            <li key={participant} className="price--guide">
              {participant}인
            </li>
          ))}
        </ul>
        <ul className="price--list">
          {renderPrice.map((price, index) => (
            <li key={index} className="price">
              {price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MiniPriceItem;
