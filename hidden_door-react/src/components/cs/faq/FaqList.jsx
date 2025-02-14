import FaqItem from "./FaqItem";

const FaqList = ({ faqList }) => {
  return (
    <table className="faq-container">
      <tr className="faq-tr-header">
        <td className="faq-title">제목</td>
        <td>날짜</td>
      </tr>
      {faqList.map((faq) => (
        <FaqItem key={faq.faqId} faq={faq} />
      ))}
    </table>
  );
};

export default FaqList;
