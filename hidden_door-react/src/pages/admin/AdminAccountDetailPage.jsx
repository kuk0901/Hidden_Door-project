import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import AdminDetailContent from "@components/admin/AdminDetailContent";
import { useAdmin } from "@hooks/useAdmin";
import Loading from "@components/common/loading/Loading";

// FIXME: 데이터 수정 부분 추가해야 함
const AdminAccountDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [adminData, setAdminData] = useState(location.state?.adminData || null);
  const [page, setPage] = useState(location.state?.page || {});
  const [search, setSearch] = useState(location.state?.search || {});
  const { admin, isSuperAdmin } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (location.state) {
      setAdminData(location.state.adminData || null);
      setPage(location.state.page || {});
      setSearch(location.state.search || {});
    }

    if (!adminData) {
      fetchAdminData();
    }

    if (searchParams.get("new") === "true") {
      toast.success("관리자 계정이 생성되었습니다.");
      setSearchParams({});
    }
  }, [location.state, searchParams]);

  const fetchAdminData = async () => {
    try {
      const res = await Api.get(`/admins/account/${id}`);
      setAdminData(res.data.data);
    } catch (error) {
      toast.error("관리자 정보를 불러오는데 실패했습니다.");
      console.error("Error fetching admin data:", error);
    }
  };

  const handleGoBack = () => {
    navigate("/hidden_door/admin/account", { state: { page, search } });
  };

  if (!adminData) {
    return <Loading />;
  }

  return (
    <div className="admin--detail--container">
      <header className="admin--detail--header--container">
        <h2 className="admin--detail--header">
          &quot;{adminData.userName}&quot;의 상세 정보
        </h2>

        <div className="btn-container">
          <button onClick={handleGoBack} className="btn">
            돌아가기
          </button>
        </div>
      </header>

      {/* admin 정보 */}
      <section className="admin--detail">
        <AdminDetailContent
          adminData={adminData}
          setAdminData={setAdminData}
          isSuperAdmin={isSuperAdmin}
          currentAdminEmail={admin.email}
          page={page}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
        />
      </section>
    </div>
  );
};

export default AdminAccountDetailPage;
