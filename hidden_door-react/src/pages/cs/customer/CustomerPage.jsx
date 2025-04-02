import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import SearchForm from "@components/common/form/SearchForm";
import Pagination from "@components/common/navigation/pagination/Pagination";
import CustomerList from "../../../components/cs/customer/CustomerList";

const CustomerPage = () => {
  const location = useLocation();
  const { admin } = useAdmin();
  const [customerList, setCustomerList] = useState([]);
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

  const getAllCustomer = async (
    newPage = 1,
    searchField = "",
    searchTerm = ""
  ) => {
    try {
      const { size, sortField, sortDirection } = page;
      const res = await Api.get("/customers/list", {
        params: {
          page: newPage,
          size,
          sortField,
          sortDirection,
          searchField,
          searchTerm
        }
      });

      // XXX: response.status !== 200 조건으로 사용해 toast로 에러 메시지 띄우는 형태로 수정해 주세요.

      setCustomerList(res.data.data);
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
    getAllCustomer(1, searchField, searchTerm);
  };

  const handlePageChange = (newPage) => {
    getAllCustomer(newPage, search.searchField, search.searchTerm);
  };

  useEffect(() => {
    getAllCustomer();
  }, []);

  const handleReset = () => {
    setSearch({ searchField: "", searchTerm: "" });
    getAllCustomer();
  };

  const searchFields = [
    { value: "", label: "검색 필드 선택" },
    { value: "customerTitle", label: "제목" },
    { value: "customerContent", label: "질문내용" }
  ];

  const handleAddCustomer = () => {
    navigate("/hidden_door/cs/customer/add");
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
            {admin && (
              <button className="btn" onClick={handleAddCustomer}>
                질문하기
              </button>
            )}
          </div>

          <div className="cs-main-container">
            <CustomerList customerList={customerList} />
          </div>

          <Pagination page={page} onPageChange={handlePageChange} />
        </div>
      </section>

      <div></div>
    </>
  );
};

export default CustomerPage;
