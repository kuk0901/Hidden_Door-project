import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import FaqDetail from "../../../components/cs/faq/FaqDetail.jsx";

const FaqDetailPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { admin } = useAdmin();
  const { faqId } = useParams();
  const [faqDetail, setFaqDetail] = useState(null);
  const navigate = useNavigate();

  const getFaqDetail = async () => {
    try {
      const res = await Api.get(`/faqs/faq/${faqId}`);

      // 조건문으로 res.status 확인 코드 추가해 주세요.

      setFaqDetail(res.data.data);
    } catch (error) {
      // XXX: 서버에서 전송되는 메시지가 있다면 해당 메시지 사용 없다면, 더 명확한 메시지 내용으로 수정해 주세요.
      toast.error(error.message || "오류입니다.");
    }
  };

  const handleListFaq = () => {
    navigate("/hidden_door/cs/faq");
  };

  const handleUpdateFaq = () => {
    navigate(`/hidden_door/cs/faq/update/${faqId}`);
  };

  useEffect(() => {
    if (searchParams.get("register") === "true") {
      toast.success("FAQ가 등록되었습니다.");
    }

    if (searchParams.get("update") === "true") {
      toast.success("FAQ가 수정되었습니다.");
    }

    setSearchParams({});
    getFaqDetail();
  }, []);

  return (
    <div className="faq-detail-container">
      <FaqDetail faqDetail={faqDetail} />

      <div className="faq-btn-container">
        {admin && (
          <button className="btn" onClick={handleUpdateFaq}>
            수정하기
          </button>
        )}

        <button className="btn" onClick={handleListFaq}>
          목록으로
        </button>
      </div>
    </div>
  );
};

export default FaqDetailPage;
