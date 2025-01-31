const FaqItem = ({ faq }) => {
  return (
    <li>
      <div>{faq.answer}</div>
      <div>{faq.kstCreDate}</div>
      <div>{faq.kstModDate}</div>
    </li>
  );
};

export default FaqItem;
