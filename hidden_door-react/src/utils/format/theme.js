import { formatNumberToPrice } from "@utils/format/number";

export const formatThemeFieldContent = (field, value) => {
  switch (field) {
    case "minParticipants":
    case "maxParticipants":
      return `${value}명`;
    case "time":
      return `${value}(분)`;
    case "price":
      return `${formatNumberToPrice(value)}(원)`;
    default:
      return value;
  }
};
