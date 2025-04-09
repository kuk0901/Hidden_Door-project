import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import SearchForm from "@components/common/form/SearchForm";
import Pagination from "@components/common/navigation/pagination/Pagination";
import FaqList from "../../../components/cs/faq/FaqList";

// XXX: 데이터 업데이트 가능성이 낮은 Faq는 recoil 사용 형태로 변경 부탁드립니다.
const FaqPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { isSuperAdmin } = useAdmin();
  const [faqList, setFaqList] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(
    location.state?.page || {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      isFirst: true,
      isLast: true,
      sortField: "id",
      sortDirection: "ASC"
    }
  );

  const [search, setSearch] = useState(
    location.state?.search || {
      searchField: "",
      searchTerm: ""
    }
  );

  const getAllFaq = async (newPage = 1, searchField = "", searchTerm = "") => {
    try {
      const { size, sortField, sortDirection } = page;
      const res = await Api.get("/faqs/list", {
        params: {
          page: newPage,
          size,
          sortField,
          sortDirection,
          searchField,
          searchTerm
        }
      });

      if (res.status !== 200) {
        // XXX: 더 명확한 메시지로 수정해 주세요.
        toast.error("오류입니다.");
      }

      setFaqList(res.data.data);
      setPage(res.data.pageDto);
      setSearch({
        searchField: res.data.searchField,
        searchTerm: res.data.searchTerm
      });
    } catch (error) {
      toast.error(error.message || "오류입니다");
    }
  };

  const handleSearch = (searchField, searchTerm) => {
    getAllFaq(1, searchField, searchTerm);
  };

  const handlePageChange = (newPage) => {
    getAllFaq(newPage, search.searchField, search.searchTerm);
  };

  useEffect(() => {
    if (searchParams.get("delete") === "true") {
      toast.success("FAQ가 삭제되었습니다.");
    }

    setSearchParams({});

    getAllFaq();
  }, []);

  const handleReset = () => {
    setSearch({ searchField: "", searchTerm: "" });
    getAllFaq();
  };

  const searchFields = [
    { value: "", label: "검색 필드 선택" },
    { value: "title", label: "제목" },
    { value: "question", label: "질문내용" }
  ];

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

          <div className="cs-search-section">
            <SearchForm
              onSearch={handleSearch}
              fields={searchFields}
              initialValues={search}
              onReset={handleReset}
            />
          </div>
          <div className="btn-container">
            {isSuperAdmin && (
              <button className="btn" onClick={handleAddFaq}>
                FAQ추가
              </button>
            )}
          </div>

          <div className="cs-main-container">
            <FaqList faqList={faqList} />
          </div>

          <Pagination page={page} onPageChange={handlePageChange} />
        </div>
      </section>

      <div></div>
    </>
  );
};

export default FaqPage;
