const PolicyItem = ({ item }) => {
  return (
    <li className="policy-item">
      - {!item.isNumeric && <span>{item.key}: </span>}
      <span>{item.value}</span>
    </li>
  );
};

export default PolicyItem;
