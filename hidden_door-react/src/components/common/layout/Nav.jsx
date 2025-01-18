import { useAdmin } from "@hooks/useAdmin";
import Button from "@components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@components/common/Logo";
import Api from "@/axios/api";
import LinkContainer from "@components/common/LinkContainer";
import { debounce } from "lodash";
import { useState, useEffect } from "react";
import { headerLinkList } from "@routes/linkList";
import More from "@components/common/More";

const Nav = () => {
  const { admin, setAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Api.post("/api/v1/auth/terminate", {}, { withCredentials: true });
      setAdmin(null);
      localStorage.removeItem("token");
      navigate(import.meta.env.VITE_APP_ADMIN_LOGIN_PATH + "?signout=true");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200);

    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel(); // debounce 취소
    };
  }, []); // 빈 배열로 의존성 설정

  return (
    <nav className="nav">
      {windowWidth > 768 ? (
        <>
          <div className="logo-container">
            <Logo />
          </div>

          <ul className="link-container">
            <LinkContainer linkList={headerLinkList} />
            {admin && (
              <Link to="#" className="link-item">
                관리자
              </Link>
            )}
          </ul>
        </>
      ) : (
        <>
          <ul className="link-container link-container__mini">
            <More />
          </ul>

          <div className="logo-container">
            <Logo />
          </div>
        </>
      )}

      {admin && <Button text="로그아웃" onClick={handleLogout} />}
    </nav>
  );
};

export default Nav;
