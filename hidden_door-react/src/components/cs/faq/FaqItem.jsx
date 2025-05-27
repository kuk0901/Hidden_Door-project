import { useNavigate } from "react-router-dom";

const FaqItem = ({ faq, page, search }) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate(`/hidden_door/cs/faq/${faq.faqId}`, {
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
      >
        {faq.title}
      </div>
      <div className="cs-date">{faq.kstCreDate}</div>
    </li>
  );
};

export default FaqItem;
