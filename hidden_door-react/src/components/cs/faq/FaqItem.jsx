const FaqItem = ({ faq }) => {
  return (
    <li className="faq-tr-content">
      <div>
        <a href={`/hidden_door/cs/faq/${faq.faqId}`}>{faq.title}</a>
      </div>
      <div>{faq.kstCreDate}</div>
    </li>
  );
};

export default FaqItem;
