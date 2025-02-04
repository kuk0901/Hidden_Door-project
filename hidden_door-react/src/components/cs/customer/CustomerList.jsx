import CustomerItem from "./CustomerItem";

const CustomerList = ({ customerList }) => {
  return (
    <ul className="customer-container">
      {customerList.map((customer) => (
        <CustomerItem key={customer.customerId} customer={customer} />
      ))}
    </ul>
  );
};

export default CustomerList;
