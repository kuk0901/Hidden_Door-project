import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import FaqDetail from "../../../components/cs/faq/FaqDetail.jsx";

const FaqDetailPage = () => {
  const { admin } = useAdmin();
  const { faqId } = useParams();
  const [faqDetail, setFaqDetail] = useState(null);
  const navigate = useNavigate();

  const getFaqDetail = async () => {
    try {
      const res = await Api.get(`/faqs/faq/${faqId}`);
      setFaqDetail(res.data.data);
    } catch (error) {
      toast.error(error.message || "오류입니다.");
    }
  };

  const handleListFaq = () => {
    navigate("/hidden_door/cs/faq");
  };

  const handleUpdateFaq = () => {
    navigate(`/hidden_door/cs/faq/update/${faqId}`);
  };

  const deleteFaq = async () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await Api.delete(`/faqs/faq/delete/${faqId}`);
      // XXX: response.status !== 200 조건으로 사용해 toast로 에러 메시지 띄우는 형태로 수정해 주세요.
      // 또한, 삭제에 대한 메시지는 쿼리 스트링 처리 후 List 페이지로 이동시키는 코드를 추가하는 게 좋을 것 같습니다.

      toast.success("FAQ가 삭제되었습니다.");
    } catch (error) {
      toast.error(error.message || "삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    getFaqDetail();
  }, [faqId]);

  return (
    <div className="faq-detail-container">
      <FaqDetail faqDetail={faqDetail} />

      <div className="faq-btn-container">
        {admin && (
          <button className="btn" onClick={handleUpdateFaq}>
            수정하기
          </button>
        )}

        {admin && (
          <button className="btn" onClick={deleteFaq}>
            삭제
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
