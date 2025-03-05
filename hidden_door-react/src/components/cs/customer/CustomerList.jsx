import CustomerItem from "./CustomerItem";

const CustomerList = ({ customerList }) => {
  return (
    <ul className="faq-container">
      <li className="faq-li-header">
        <div className="faq-title">제목</div>
        <div>답변 유무</div>
        <div>날짜</div>
      </li>
      {customerList.map((customer) => (
        <CustomerItem key={customer.customerId} customer={customer} />
      ))}
    </ul>
  );
};

export default CustomerList;
