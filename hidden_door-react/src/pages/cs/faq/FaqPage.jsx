import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";
import FaqList from "../../../components/cs/faq/FaqList";

const FaqPage = () => {
  const [faqList, setFaqList] = useState([]);

  const getAllFaq = async () => {
    try {
      const res = await Api.get("/api/v1/faqs/list");

      console.log(res.data.data);
      console.log(res.data.msg);

      setFaqList(res.data.data);
    } catch (error) {
      toast.error(error.message || "오류입니다");
    }
  };

  useEffect(() => {
    getAllFaq();
  }, []);

  return (
    <>
      <section>
        <div className="cs-body">
          <div className="cs-header">고객센터</div>

          <div className="cs-move">
            <div>FAQ</div>
            <div>1:1 문의</div>
          </div>

          <div className="cs-add-button">
            <button>FAQ추가</button>
          </div>

          <div className="cs-main-container">
            <FaqList faqList={faqList} />
          </div>
        </div>
      </section>

      <div></div>
    </>
  );
};

export default FaqPage;
