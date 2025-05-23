import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
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
  const location = useLocation();
  const [page, setPage] = useState(location.state?.page || {});
  const [search, setSearch] = useState(location.state?.search || {});

  const getFaqDetail = async () => {
    try {
      const res = await Api.get(`/faqs/faq/${faqId}`);

      if (res.status !== 200) {
        toast.error("FAQ 정보를 불러오는 데 실패했습니다.");
      }

      setFaqDetail(res.data.data);
    } catch (error) {
      toast.error(error.message || "FAQ불러오기에 실패했습니다.");
    }
  };

  const handleListFaq = () => {
    navigate("/hidden_door/cs/faq", { state: { page, search } });
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

  useEffect(() => {
    if (location.state) {
      setPage(location.state.page);
      setSearch(location.state.search);
    }
  }, [location.state]);

  return (
    <section className="faq-detail-container">
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
    </section>
  );
};

export default FaqDetailPage;
