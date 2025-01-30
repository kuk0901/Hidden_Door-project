import { formatNumberToPrice } from "@utils/format/number";

const PriceItem = ({ theme, participants }) => {
  const renderPrice = () => {
    if (
      participants < theme.minParticipants ||
      participants > theme.maxParticipants
    ) {
      return "-";
    }
    return formatNumberToPrice(theme.price * participants);
  };

  return (
    <div className="price">
      {participants === 0 ? (
        <div className="price--themeName">
          {theme.themeName}
          <span>({theme.time}분)</span>
        </div>
      ) : (
        renderPrice()
      )}
    </div>
  );
};

export default PriceItem;
