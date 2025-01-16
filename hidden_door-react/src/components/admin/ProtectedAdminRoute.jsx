import { Outlet, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { adminState } from "../../atoms/adminAtom";
import Loading from "../common/loading/Loading";

const ProtectedAdminRoute = () => {
  const { user, loading } = useRecoilValue(adminState);

  const loginPath = import.meta.env.VITE_APP_ADMIN_LOGIN_PATH;

  if (loading) return <Loading />;

  return user ? <Outlet /> : <Navigate to={loginPath} />;
};

export default ProtectedAdminRoute;
