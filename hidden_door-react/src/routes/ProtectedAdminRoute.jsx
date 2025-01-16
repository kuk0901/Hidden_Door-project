import { useAdmin } from "@hooks/useAdmin";
import { useNavigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { admin } = useAdmin();
  const navigate = useNavigate();

  if (!admin) {
    navigate(import.meta.env.VITE_APP_ADMIN_LOGIN_PATH);
    return null;
  }

  return children;
};

export default ProtectedAdminRoute;
