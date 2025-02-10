import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";

const FaqAddPage = () => {
  const [newFaq, setNewFaq] = useState({
    title: "",
    question: "",
    answer: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaq({ ...newFaq, [name]: value });
  };

  const fetchFaqAdd = async () => {
    try {
      if (!newFaq.title || !newFaq.question || !newFaq.answer) {
        toast.error("모든 필드를 입력해주세요.");
        return;
      }

      const res = await Api.post("/api/v1/faqs/faq/add", newFaq);
      setNewFaq({
        title: "",
        question: "",
        answer: "",
      });
      toast.success(res.data.msg || "FAQ 추가 완료");
    } catch (error) {
      console.log(error);
      toast.error("서버 오류가 발생했습니다.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFaqAdd();
  };

  return (
    <div>
      <div className="faqadd-input-box">
        <form onSubmit={handleSubmit}>
          <div className="faqadd-input-title">
            <input
              type="text"
              name="title"
              onChange={handleInputChange}
              placeholder="제목을 작성해 주세요."
              value={newFaq.title}
            />
          </div>
          <div className="faqadd-input-content">
            <textarea
              name="question"
              onChange={handleInputChange}
              placeholder="질문을 작성해 주세요."
              value={newFaq.question}
              rows="4" // 높이 조정
            />
          </div>
          <div className="faqadd-input-content">
            <textarea
              name="answer"
              onChange={handleInputChange}
              placeholder="답변을 작성해 주세요."
              value={newFaq.answer}
              rows="6" // 높이 조정
            />
          </div>
          <button className="faqadd-input-button" type="submit">
            추가
          </button>
        </form>
      </div>
    </div>
  );
};

export default FaqAddPage;
