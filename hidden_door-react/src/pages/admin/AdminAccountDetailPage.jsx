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

const AdminAccountDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [adminData, setAdminData] = useState(null);
  const [page, setPage] = useState(location.state?.page || {});
  const [search, setSearch] = useState(location.state?.search || {});
  const { admin, isSuperAdmin } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchAdminData = async () => {
    try {
      const res = await Api.get(`/admins/account/${accountId}`);

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setAdminData(res.data.data);
    } catch (error) {
      toast.error("관리자 정보를 불러오는데 실패했습니다.");
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    fetchAdminData();

    if (location.state) {
      setPage(location.state.page || {});
      setSearch(location.state.search || {});
    }

    if (searchParams.get("new") === "true") {
      toast.success("관리자 계정이 생성되었습니다.");
      setSearchParams({});
    }
  }, [location.state, searchParams]);

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
