import { formatNumberToPrice } from "@utils/format/number";

const OneThemePriceItem = ({ theme, participants }) => {
  const renderPrice = () => {
    if (
      participants < theme.minParticipants ||
      participants > theme.maxParticipants
    ) {
      return "-";
    }
    return formatNumberToPrice(theme.price * participants);
  };

  return <div className="price">{renderPrice()}</div>;
};

export default OneThemePriceItem;
