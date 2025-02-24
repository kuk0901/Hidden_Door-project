import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import AccountList from "@components/admin/AccountList";
import SearchForm from "@components/common/form/SearchForm";
import Pagination from "@components/common/navigation/pagination/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

// FIXME: 관리자 추가 영역: NewAdminAccountForm 컴포넌트 생성 또는 기존 Form 컴포넌트 사용
const AdminAccountPage = () => {
  const location = useLocation();
  const { admin } = useAdmin();
  const [adminList, setAdminList] = useState([]);
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
      searchField: "all",
      searchTerm: ""
    }
  );
  const [newAccountAddVisible, setNewAccountAddVisible] = useState(false);
  const navigate = useNavigate();

  const handleGetAdminList = async (
    newPage = 1,
    searchField = "all",
    searchTerm = ""
  ) => {
    try {
      const { size, sortField, sortDirection } = page;
      const res = await Api.get("/admins/all", {
        params: {
          page: newPage,
          size,
          sortField,
          sortDirection,
          searchField,
          searchTerm
        }
      });
      setAdminList(res.data.data);
      setPage({ ...page, ...res.data.pageDto });
      setSearch({
        ...search,
        searchField: res.data.searchField,
        searchTerm: res.data.searchTerm
      });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("이 작업을 수행할 권한이 없습니다.");
      } else {
        toast.error(
          error.message ||
            "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      }
      console.error("Error fetching admin list:", error);
    }
  };

  const handleSearch = (searchField, searchTerm) => {
    handleGetAdminList(1, searchField, searchTerm);
  };

  const handlePageChange = (newPage) => {
    handleGetAdminList(newPage, "", search);
  };

  // FIXME: handleAddAdmin 함수 -> newAdminData를 인자로 받아 새로운 관리자 추가
  const handleAddAdmin = async (newAdminData) => {
    try {
      const res = await Api.post("/admins", newAdminData);
      navigate(`/hidden_door/admin/account/${res.data.adminId}?new=true`, {
        state: { page, search }
      });
    } catch (error) {
      toast.error("관리자 추가에 실패했습니다.");
      console.error("Error adding admin:", error);
    }
  };

  useEffect(() => {
    if (location.state?.page || location.state?.search) {
      console.log(location.state);
      console.log("page", location.state.page);
      console.log("search", location.state.search);
      handleGetAdminList(page.page, search.searchField, search.searchTerm);
    } else {
      handleGetAdminList();
    }
  }, []);

  const searchFields = [
    { value: "all", label: "전체" },
    { value: "userName", label: "이름" },
    { value: "email", label: "이메일" },
    { value: "roles", label: "역할" }
  ];

  return (
    <div className="admin--account--page">
      <section className="search--form--section">
        <h2 className="search--account--header">관리자 검색</h2>

        <div className="btn--contain--section">
          <SearchForm
            onSearch={handleSearch}
            fields={searchFields}
            initialValues={search}
          />
          {admin.roles.includes("ROLE_SUPER_ADMIN") && (
            <button
              onClick={() => setNewAccountAddVisible(!newAccountAddVisible)}
              className="btn btn--link"
            >
              관리자 추가
            </button>
          )}
        </div>
      </section>

      {/* Account List */}
      <section className="account--section">
        <AccountList
          page={page}
          search={search}
          adminList={adminList}
          role={admin.roles.includes("ROLE_SUPER_ADMIN") ? true : false}
        />
      </section>

      {/* Pagination */}
      <Pagination page={page} onPageChange={handlePageChange} />
    </div>
  );
};

export default AdminAccountPage;
