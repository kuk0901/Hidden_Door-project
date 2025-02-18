import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import FaqDetail from "../../../components/cs/faq/FaqDetail.jsx";

const FaqDetailPage = () => {
  const { admin } = useAdmin();
  const { faqId } = useParams();
  const [faqDetail, setFaqDetail] = useState(null);

  const getFaqDetail = async () => {
    try {
      const res = await Api.get(`/api/v1/faqs/${faqId}`);
      setFaqDetail(res.data.data);
    } catch (error) {
      toast.error(error.message || "오류입니다.");
    }
  };

  const deleteFaq = async () => {
    // 삭제 전 확인을 위한 팝업
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return; // 사용자가 취소하면 삭제하지 않음

    try {
      const res = await Api.delete(`/api/v1/faqs/faq/delete/${faqId}`);
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
      {admin && <button onClick={deleteFaq}>삭제</button>}
    </div>
  );
};

export default FaqDetailPage;
