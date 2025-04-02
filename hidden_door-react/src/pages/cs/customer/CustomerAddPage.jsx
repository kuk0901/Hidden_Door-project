import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";

const CustomerAddPage = () => {
  const navigate = useNavigate();

  const [newCustomer, setNewCustomer] = useState({
    customerCheck: "X",
    customerTitle: "",
    customerPwd: "",
    customerContent: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleListCustomer = () => {
    navigate("/hidden_door/cs/customer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !newCustomer.customerTitle ||
        !newCustomer.customerPwd ||
        !newCustomer.customerContent
      ) {
        toast.error("모든 필드를 입력해주세요.");
        return;
      }

      const res = await Api.post("/customers/customer/add", newCustomer);

      // XXX: response.status !== 200 조건으로 사용해 toast로 에러 메시지 띄우는 형태로 수정해 주세요.
      // 또한, 추가되었을 경우 페이지가 이동되고 있으니 쿼리스트링을 사용해 성공 정보를 넘겨주는 형태로 수정해 주세요.

      toast.success(res.data.msg || "Customer 추가 완료");
      navigate("/hidden_door/cs/customer");
    } catch (error) {
      console.log(error);
      toast.error("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <div className="customeradd-input-box">
        <form onSubmit={handleSubmit}>
          <div className="customeradd-input-title">
            <input
              type="text"
              name="customerTitle"
              onChange={handleInputChange}
              placeholder="제목을 작성해 주세요."
              value={newCustomer.customerTitle}
            />
          </div>
          <div className="customeradd-input-title">
            <input
              type="number"
              name="customerPwd"
              onChange={handleInputChange}
              placeholder="질문의 비밀번호 숫자4개를 입력해주세요."
              value={newCustomer.customerPwd}
            />
          </div>
          <div className="customeradd-input-content">
            <textarea
              name="customerContent"
              onChange={handleInputChange}
              placeholder="질문을 작성해 주세요."
              value={newCustomer.customerContent}
              rows="4"
            />
          </div>
          <button className="customeradd-input-button" type="submit">
            추가
          </button>
          <button className="btn" onClick={handleListCustomer}>
            목록으로
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerAddPage;
