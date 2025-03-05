const CustomerItem = ({ customer }) => {
  return (
    <li className="faq-tr-content">
      <div>
        <a href={`/hidden_door/cs/customer/${customer.customerId}`}>
          {customer.customerTitle}
        </a>
      </div>
      <div className="cs-check">{customer.customerCheck}</div>
      <div className="cs-date">{customer.kstQueCreDate}</div>
    </li>
  );
};

export default CustomerItem;
