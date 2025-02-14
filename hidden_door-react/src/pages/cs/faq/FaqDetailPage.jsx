import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import FaqDetail from "../../../components/cs/faq/FaqDetail.jsx";

const FaqDetailPage = () => {
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

  useEffect(() => {
    getFaqDetail();
  }, [faqId]);

  return (
    <div className="faq-detail-container">
      <FaqDetail faqDetail={faqDetail} />
    </div>
  );
};

export default FaqDetailPage;
