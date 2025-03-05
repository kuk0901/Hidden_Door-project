import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import CustomerDetail from "../../../components/cs/customer/CustomerDetail.jsx";

const CustomerDetailPage = () => {
  const { admin } = useAdmin();
  const { customerId } = useParams();
  const [customerDetail, setCustomerDetail] = useState(null);
  const navigate = useNavigate();

  const getCustomerDetail = async () => {
    try {
      const res = await Api.get(`/customers/customer/${customerId}`);
      setCustomerDetail(res.data.data);
    } catch (error) {
      toast.error(error.message || "오류입니다.");
    }
  };

  const handleListCustomer = () => {
    navigate("/hidden_door/cs/customer");
  };

  const deleteCustomer = async () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await Api.delete(`/customers/customer/delete/${customerId}`);
      toast.success("고객 정보가 삭제되었습니다.");
    } catch (error) {
      toast.error(error.message || "삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    getCustomerDetail();
  }, [customerId]);

  return (
    <div className="customer-detail-container">
      <CustomerDetail customerDetail={customerDetail} />
      {/* 홀리리 */}
      {admin && <button onClick={deleteCustomer}>삭제</button>}

      <button className="btn" onClick={handleListCustomer}>
        목록으로
      </button>
    </div>
  );
};

export default CustomerDetailPage;
