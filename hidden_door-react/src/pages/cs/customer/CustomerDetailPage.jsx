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
  const [customerAnswer, setCustomerAnswer] = useState(""); // 답변 상태 관리
  const [isAnswering, setIsAnswering] = useState(false); // 답변 입력 상태 관리
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
      // XXX: response.status !== 200 조건으로 사용해 toast로 에러 메시지 띄우는 형태로 수정해 주세요.

      toast.success(res.data.msg);
    } catch (error) {
      toast.error(error.message || "삭제에 실패했습니다.");
    }
  };

  const handleAnswerChange = (e) => {
    setCustomerAnswer(e.target.value);
  };

  const handleSubmitAnswer = async () => {
    if (!customerAnswer) {
      toast.error("답변을 입력해주세요.");
      return;
    }

    try {
      const res = await Api.post(`/customers/customer/update/${customerId}`, {
        customerAnswer: customerAnswer,
        adminName: admin.email,
        customerCheck: "O"
      });
      toast.success(res.data.msg);
      setIsAnswering(false);
      setCustomerAnswer("");

      navigate(0);
    } catch (error) {
      toast.error(error.message || "답변 제출에 실패했습니다.");
    }
  };

  useEffect(() => {
    getCustomerDetail();
  }, [customerId]);

  return (
    <div className="customer-detail-container">
      <CustomerDetail customerDetail={customerDetail} />

      <div className="faq-btn-container">
        {admin && (
          <>
            <button className="btn" onClick={deleteCustomer}>
              삭제
            </button>

            <button
              className="btn"
              onClick={() => setIsAnswering(!isAnswering)}
            >
              답변하기
            </button>

            {/* 답변 입력 상태가 true일 때 인풋 칸과 제출 버튼을 보여줌 */}
            {isAnswering && (
              <div className="answer-section">
                <textarea
                  value={customerAnswer}
                  onChange={handleAnswerChange}
                  placeholder="답변을 작성하세요."
                />
                <button className="btn" onClick={handleSubmitAnswer}>
                  답변 제출
                </button>
              </div>
            )}
          </>
        )}

        <button className="btn" onClick={handleListCustomer}>
          목록으로
        </button>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
