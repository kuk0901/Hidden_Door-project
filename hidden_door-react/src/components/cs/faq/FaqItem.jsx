const FaqItem = ({ faq }) => {
  return (
    <tr className="faq-tr-content">
      <td>{faq.title}</td>
      <td>{faq.kstCreDate}</td>
    </tr>
  );
};

export default FaqItem;
