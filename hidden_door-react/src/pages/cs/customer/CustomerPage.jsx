import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import CustomerList from "../../../components/cs/customer/CustomerList";

const CustomerPage = () => {
  const { admin } = useAdmin();
  const [customerList, setCustomerList] = useState([]);
  const navigate = useNavigate();

  const getAllCustomer = async () => {
    try {
      const res = await Api.get("/customers/list");

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

  const handleAddCustomer = () => {
    navigate("/hidden_door/cs/customer/add");
  };

  return (
    <>
      <section className="section section-cs">
        <div className="cs-body">
          <div className="cs-header">고객센터</div>

          <div className="cs-move">
            <div>
              <a href={`/hidden_door/cs/faq`}>FAQ</a>
            </div>
            <div>
              <a href={`/hidden_door/cs/customer`}>1:1 문의</a>
            </div>
          </div>

          <div className="btn-container">
            {admin && (
              <button className="btn" onClick={handleAddCustomer}>
                질문하기
              </button>
            )}
          </div>

          <div className="cs-main-container">
            <CustomerList customerList={customerList} />
          </div>
        </div>
      </section>

      <div></div>
    </>
  );
};

export default CustomerPage;
