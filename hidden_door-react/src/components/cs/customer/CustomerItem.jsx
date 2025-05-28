import { useNavigate } from "react-router-dom";

const CustomerItem = ({ customer, page, search }) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate(`/hidden_door/cs/customer/${customer.customerId}`, {
      state: { page, search },
    });
  };

  return (
    <li className="faq-tr-content">
      <div
        onClick={handleDetail}
        className="title-div"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleDetail();
        }}
        style={{ cursor: "pointer" }}
      >
        {customer.customerTitle}
      </div>
      <div className="cs-check">{customer.customerCheck}</div>
      <div className="cs-date">{customer.kstQueCreDate}</div>
    </li>
  );
};

export default CustomerItem;
