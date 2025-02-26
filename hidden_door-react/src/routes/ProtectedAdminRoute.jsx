import { useAdmin } from "@hooks/useAdmin";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const { admin } = useAdmin();

  if (!admin) {
    return <Navigate to={import.meta.env.VITE_APP_ADMIN_LOGIN_PATH} replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
