import { useAdmin } from "@hooks/useAdmin";
import Button from "@components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@components/common/Logo";
import Api from "@/axios/api";

const Header = () => {
  const { admin, setAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Api.post("/api/v1/auth/terminate", {}, { withCredentials: true });

      // 사용자 정보와 토큰 제거
      setAdmin(null);
      localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 제거

      // 로그인 페이지로 리다이렉트 (쿼리 파라미터 추가)
      navigate(import.meta.env.VITE_APP_ADMIN_LOGIN_PATH + "?signout=true");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="container">
      <Logo />

      <div className="link-container">{admin && <Link to="">관리자</Link>}</div>

      {admin && <Button text="로그아웃" onClick={handleLogout} />}
    </header>
  );
};

export default Header;
