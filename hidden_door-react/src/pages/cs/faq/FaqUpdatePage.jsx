import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import useConfirm from "@hooks/useConfirm";

const FaqUpdatePage = () => {
  const { admin } = useAdmin();
  const { faqId } = useParams();
  const [faqDetail, setFaqDetail] = useState(null);
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [newFaq, setNewFaq] = useState({
    writer: admin.email,
    title: "",
    category: "",
    question: "",
    answer: "",
  });

  const getFaqDetail = async () => {
    try {
      const res = await Api.get(`/faqs/faq/${faqId}`);
      setFaqDetail(res.data.data);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      toast.error(error.message || "오류입니다.");
    }
  };

  const handleListFaq = () => {
    navigate("/hidden_door/cs/faq");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaq({ ...newFaq, [name]: value });
  };

  const deleteFaq = async () => {
    const confirmed = await confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const response = await Api.delete(`/faqs/faq/delete/${faqId}`);

      if (response.status !== 200) {
        toast.error("삭제에 실패했습니다.");
        return;
      }

      navigate("/hidden_door/cs/faq?delete=true");
    } catch (error) {
      toast.error(error.message || "삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (faqId) {
      getFaqDetail();
    }
  }, [faqId]);

  useEffect(() => {
    if (faqDetail) {
      setNewFaq({
        writer: admin.email,
        title: faqDetail.title || "",
        question: faqDetail.question || "",
        answer: faqDetail.answer || "",
      });
    }
  }, [faqDetail, admin.email]);

  const updateFaq = async () => {
    try {
      const res = await Api.post(`/faqs/faq/update/${faqId}`, newFaq);

      if (res.status !== 200) {
        toast.error("업데이트에 실패했습니다.");
        return;
      }

      navigate(`/hidden_door/cs/faq/${res.data.data}?update=true`);
    } catch (error) {
      toast.error("FAQ 업데이트에 실패했습니다.");
      console.error("Error updating FAQ:", error);
    }
  };

  return (
    <section className="faq-detail-container">
      <div className="faqadd-input-title">
        <input
          type="text"
          name="title"
          onChange={handleInputChange}
          value={newFaq.title}
        />
      </div>
      <div className="faqadd-input-content">
        <textarea
          name="question"
          onChange={handleInputChange}
          value={newFaq.question}
          rows="4"
        />
      </div>
      <div className="faqadd-input-content">
        <textarea
          name="answer"
          onChange={handleInputChange}
          value={newFaq.answer}
          rows="6"
        />
      </div>

      {admin && (
        <button className="btn" onClick={deleteFaq}>
          삭제
        </button>
      )}

      {admin && (
        <button className="btn" onClick={updateFaq}>
          수정하기
        </button>
      )}

      <button className="btn" onClick={handleListFaq}>
        목록으로
      </button>
    </section>
  );
};

export default FaqUpdatePage;
