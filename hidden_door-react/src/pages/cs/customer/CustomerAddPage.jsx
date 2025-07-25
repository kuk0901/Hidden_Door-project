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
    customerContent: "",
  });

  const [isActive, setIsActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleListCustomer = () => {
    navigate("/hidden_door/cs/customer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsActive(true);
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

      if (res.status !== 200) {
        toast.error("질문을 추가하는데 실패했습니다.");
      }

      navigate(`/hidden_door/cs/customer/${res.data.data}?register=true`);
    } catch (error) {
      console.log(error);
      toast.error("질문을 추가하는데 실패했습니다.");
    }
  };

  return (
    <section>
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

          <div className="customerAdd-btn-container">
            <button className="btn" type="submit" disabled={isActive}>
              추가
            </button>
            <button className="btn" onClick={handleListCustomer} type="button">
              목록으로
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CustomerAddPage;
