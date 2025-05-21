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
      <button onClick={handleDetail} className="title-div">
        {faq.title}
      </button>
      <div className="cs-date">{faq.kstCreDate}</div>
    </li>
  );
};

export default FaqItem;
