import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";
import CustomerList from "../../../components/cs/customer/CustomerList";

const CustomerPage = () => {
  const [customerList, setCustomerList] = useState([]);

  const getAllCustomer = async () => {
    try {
      const res = await Api.get("/api/v1/Customers/list");

      console.log(res.data.data);
      console.log(res.data.msg);

      setCustomerList(res.data.data);
    } catch (error) {
      toast.error(error.message || "오류입니다");
    }
  };

  useEffect(() => {
    getAllCustomer();
  }, []);

  return (
    <>
      <section>
        <CustomerList customerList={customerList} />
      </section>
      <div></div>
    </>
  );
};

export default CustomerPage;
