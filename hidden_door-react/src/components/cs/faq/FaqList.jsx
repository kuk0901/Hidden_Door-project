import FaqItem from "./FaqItem";

const FaqList = ({ faqList }) => {
  return (
    <ul className="faq-container">
      {faqList.map((faq) => (
        <FaqItem key={faq.id} faq={faq} />
      ))}
    </ul>
  );
};

export default FaqList;
