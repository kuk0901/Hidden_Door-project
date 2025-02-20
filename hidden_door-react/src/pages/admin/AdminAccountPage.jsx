import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import AccountList from "@components/admin/AccountList";
import SearchForm from "@components/common/form/SearchForm";

const AdminAccountPage = () => {
  const { admin } = useAdmin();
  const [adminList, setAdminList] = useState([]);
  const [page, setPage] = useState({});
  const [search, setSearch] = useState("");

  const handleGetAdminList = async () => {
    try {
      const res = await Api.get("/admins/all");
      setAdminList(res.data.data);
      setPage(res.data.pageDto);
      setSearch(res.data.search ? res.data.search : "");
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

  const searchFields = [
    { value: "userName", label: "이름" },
    { value: "email", label: "이메일" },
    { value: "role", label: "역할" }
  ];

  const handleSearch = (searchField, searchTerm) => {
    handleGetAdminList(searchField, searchTerm);
  };

  useEffect(() => {
    handleGetAdminList();
  }, []);

  return (
    <>
      {/* FIXME: search -> 구조만 잡아놓은 상태 */}
      <section className="search--form">
        <SearchForm onSearch={handleSearch} fields={searchFields} />
      </section>
      <section className="account--section">
        <AccountList
          page={page}
          search={search}
          adminList={adminList}
          role={admin.roles.includes("ROLE_SUPER_ADMIN") ? true : false}
        />
      </section>
    </>
  );
};

export default AdminAccountPage;
