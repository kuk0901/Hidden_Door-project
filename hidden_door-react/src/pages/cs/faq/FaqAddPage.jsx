import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";

const FaqAddPage = () => {
  const { admin } = useAdmin();

  console.log(admin);

  const [newFaq, setNewFaq] = useState({
    writer: admin.email,
    title: "",
    category: "",
    question: "",
    answer: "",
  });

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setNewFaq({ ...newFaq, category: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaq({ ...newFaq, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newFaq.title || !newFaq.question || !newFaq.answer) {
        toast.error("모든 필드를 입력해주세요.");
        return;
      }

      const res = await Api.post("/api/v1/faqs/faq/add", newFaq);

      toast.success(res.data.msg || "FAQ 추가 완료");
    } catch (error) {
      console.log(error);
      toast.error("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {/* c:if */}
      {admin && <button>asd</button>}
      <div>
        <div className="faqadd-input-box">
          <form onSubmit={handleSubmit}>
            <div className="faqadd-input-category">
              <select
                name="category"
                value={newFaq.category}
                onChange={handleCategoryChange}
              >
                <option value="category1">예약</option>
                <option value="category2">예약 취소</option>
                <option value="category3">환불</option>
              </select>
            </div>

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
                rows="4"
              />
            </div>
            <div className="faqadd-input-content">
              <textarea
                name="answer"
                onChange={handleInputChange}
                placeholder="답변을 작성해 주세요."
                value={newFaq.answer}
                rows="6"
              />
            </div>
            <button className="faqadd-input-button" type="submit">
              추가
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FaqAddPage;
