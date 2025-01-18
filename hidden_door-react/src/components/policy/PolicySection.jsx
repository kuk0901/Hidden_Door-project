import PolicyItem from "./PolicyItem";

const PolicySection = ({ title, content }) => {
  const processedContent = Object.entries(content).map(([key, value]) => ({
    key,
    value,
    isNumeric: !isNaN(parseFloat(key)) && isFinite(key)
  }));

  return (
    <li className="policy-list">
      <h3 className="semibold">{title}</h3>
      <ul>
        {processedContent.map((item, index) => (
          <PolicyItem key={index} item={item} />
        ))}
      </ul>
    </li>
  );
};

export default PolicySection;
