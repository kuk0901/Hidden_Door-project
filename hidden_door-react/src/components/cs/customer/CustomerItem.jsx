import { useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";

const CustomerItem = ({ customer, page, search }) => {
  const navigate = useNavigate();

  const handleDetail = async () => {
    const input = prompt("비밀번호를 입력하세요 (숫자만)");

    if (!input) return;

    const password = parseInt(input, 10);
    if (isNaN(password)) {
      toast.error("숫자만 입력하세요.");
      return;
    }

    try {
      const res = await Api.post("/customers/customer/verify-password", {
        customerId: customer.customerId,
        password,
      });

      if (res.status === 200 && res.data.data) {
        navigate(`/hidden_door/cs/customer/${customer.customerId}`, {
          state: { page, search },
        });
      } else {
        toast.error("비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      toast.error("비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <li className="faq-tr-content">
      <button onClick={handleDetail} className="title-div" type="button">
        {customer.customerTitle}
      </button>
      <div className="cs-check">{customer.customerCheck}</div>
      <div className="cs-date">{customer.kstQueCreDate}</div>
    </li>
  );
};

export default CustomerItem;
