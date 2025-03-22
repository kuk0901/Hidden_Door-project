import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import AccountList from "@components/admin/AccountList";
import SearchForm from "@components/common/form/SearchForm";
import Pagination from "@components/common/navigation/pagination/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import NewAdminAddForm from "@components/admin/NewAdminAddForm";

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
      searchField: "",
      searchTerm: ""
    }
  );

  const [newAccountAddVisible, setNewAccountAddVisible] = useState(false);
  const navigate = useNavigate();

  const handleGetAdminList = async (
    newPage = 1,
    searchField = "",
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

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setAdminList(res.data.data);
      setPage(res.data.pageDto);
      setSearch({
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
    handleGetAdminList(newPage, search.searchField, search.searchTerm);
  };

  const handleAddAdmin = async (newAdminData) => {
    try {
      const res = await Api.post("/auth/register", newAdminData, {
        withCredentials: true
      });

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      await handleGetAdminList(
        page.page,
        search.searchField,
        search.searchTerm
      );

      navigate(`/hidden_door/admin/account/${res.data.data.adminId}?new=true`, {
        state: { page, search }
      });
    } catch (error) {
      toast.error("관리자 추가에 실패했습니다.");
      console.error("Error adding admin:", error);
    }
  };

  useEffect(() => {
    if (location.state?.page || location.state?.search) {
      setPage(location.state.page);
      setSearch(location.state.search);
      handleGetAdminList(
        location.state.page.page,
        location.state.search.searchField,
        location.state.search.searchTerm
      );
    } else {
      handleGetAdminList();
    }
  }, [location.state]);

  const searchFields = [
    { value: "", label: "검색 필드 선택" },
    { value: "userName", label: "이름" },
    { value: "email", label: "이메일" },
    { value: "roles", label: "역할" }
  ];

  const handleReset = () => {
    setSearch({ searchField: "", searchTerm: "" });
    handleGetAdminList();
  };

  return (
    <div className="admin--account--page">
      <section className="search--form--section">
        <div className="btn--contain--section">
          <SearchForm
            onSearch={handleSearch}
            fields={searchFields}
            initialValues={search}
            onReset={handleReset}
          />

          {admin.roles.includes("ROLE_SUPER_ADMIN") && (
            <div className="btn-container">
              <button
                onClick={() => setNewAccountAddVisible(!newAccountAddVisible)}
                className="btn btn--link"
              >
                관리자 추가
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Account List */}
      <section className="account--section">
        <AccountList
          page={{ ...page }}
          search={{ ...search }}
          adminList={adminList}
          setAdminList={setAdminList}
          setPage={setPage}
          setSearch={setSearch}
          role={admin.roles.includes("ROLE_SUPER_ADMIN") ? true : false}
        />
      </section>

      {/* Pagination */}
      <Pagination page={page} onPageChange={handlePageChange} />

      {newAccountAddVisible && (
        <>
          <div className="overlay"></div>
          <NewAdminAddForm
            onSubmit={handleAddAdmin}
            onCancel={() => setNewAccountAddVisible(false)}
          />
        </>
      )}
    </div>
  );
};

export default AdminAccountPage;
