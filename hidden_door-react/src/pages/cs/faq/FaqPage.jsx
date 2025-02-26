import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import FaqList from "../../../components/cs/faq/FaqList";

const FaqPage = () => {
  const { admin } = useAdmin();
  const [faqList, setFaqList] = useState([]);
  const navigate = useNavigate();

  const getAllFaq = async () => {
    try {
      const res = await Api.get("/faqs/list");

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

  const handleAddFaq = () => {
    navigate("/hidden_door/cs/faq/add");
  };

  return (
    <>
      <section className="section section-cs">
        <div className="cs-body">
          <div className="cs-header">고객센터</div>

          <div className="cs-move">
            <div>
              <a href={`/hidden_door/cs/faq`}>FAQ</a>
            </div>
            <div>
              <a href={`/hidden_door/cs/customer`}>1:1 문의</a>
            </div>
          </div>

          <div className="btn-container">
            {admin && (
              <button className="btn" onClick={handleAddFaq}>
                FAQ추가
              </button>
            )}
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
