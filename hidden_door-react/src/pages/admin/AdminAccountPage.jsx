import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import AccountList from "@components/admin/AccountList";
import SearchForm from "@components/common/form/SearchForm";
import Pagination from "@components/common/navigation/pagination/Pagination";

const AdminAccountPage = () => {
  const { admin } = useAdmin();
  const [adminList, setAdminList] = useState([]);
  const [page, setPage] = useState({
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    isFirst: true,
    isLast: true,
    sortField: "id",
    sortDirection: "ASC"
  });
  const [search, setSearch] = useState("");

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
      setAdminList(res.data.data);
      setPage(res.data.pageDto);
      setSearch(searchTerm);
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

  useEffect(() => {
    handleGetAdminList();
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
        <SearchForm onSearch={handleSearch} fields={searchFields} />
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
