import FaqItem from "./FaqItem";

const FaqList = ({ faqList }) => {
  return (
    <ul className="faq-container">
      <li className="faq-li-header">
        <div className="faq-title">제목</div>
        <div>날짜</div>
      </li>
      {faqList.map((faq) => (
        <FaqItem key={faq.faqId} faq={faq} />
      ))}
    </ul>
  );
};

export default FaqList;
