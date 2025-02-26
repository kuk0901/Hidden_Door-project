const CustomerItem = ({ customer }) => {
  return (
    <li className="faq-tr-content">
      <div>
        <a href={`/hidden_door/cs/faq/${customer.customerId}`}>
          {customer.customerTitle}
        </a>
      </div>
      <div>{customer.kstQueCreDate}</div>
    </li>
  );
};

export default CustomerItem;
