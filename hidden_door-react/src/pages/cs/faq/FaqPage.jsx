import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";
import FaqList from "../../../components/cs/faq/FaqList";

const FaqPage = () => {
  const [faqList, setFaqList] = useState({});

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
        <FaqList faqList={faqList} />
      </section>
    </>
  );
};

export default FaqPage;
