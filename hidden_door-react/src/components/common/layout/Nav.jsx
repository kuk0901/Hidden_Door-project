import { useAdmin } from "@hooks/useAdmin";
import Button from "@components/common/buttons/Button";
import { useNavigate } from "react-router-dom";
import Logo from "@components/common/branding/Logo";
import Api from "@/axios/api";
import LinkContainer from "@components/common/navigation/LinkContainer";
import { debounce } from "lodash";
import { useState, useEffect, useRef } from "react";
import { navLinkList } from "@routes/linkList";
import MobileNavMenu from "@components/common/navigation/MobileNavMenu";
import AdminMenu from "@components/common/navigation/AdminMenu";

const Nav = () => {
  const { admin, setAdmin } = useAdmin();
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const adminMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await Api.post("/auth/terminate", {}, { withCredentials: true });
      setAdmin(null);
      localStorage.removeItem("token");
      navigate(import.meta.env.VITE_APP_ADMIN_LOGIN_PATH + "?signout=true");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleAdminMenu = () => {
    setShowAdminMenu(!showAdminMenu);
  };

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
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setShowAdminMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="nav">
      {windowWidth > 768 ? (
        <>
          <div className="logo-container">
            <Logo />
          </div>

          <ul className="link-container">
            <LinkContainer linkList={navLinkList} />

            {admin && (
              <li className="link-item--last" ref={adminMenuRef}>
                <button
                  onClick={toggleAdminMenu}
                  className="link-item btn--no btn--admin-menu"
                >
                  관리자
                </button>
                {showAdminMenu && (
                  <AdminMenu onClose={() => setShowAdminMenu(false)} />
                )}
              </li>
            )}
          </ul>
        </>
      ) : (
        <>
          <ul className="link-container link-container__mini">
            <MobileNavMenu />
          </ul>

          <div className="logo-container">
            <Logo />
          </div>
        </>
      )}

      {admin && (
        <Button
          text="로그아웃"
          onClick={handleLogout}
          className="btn--signout"
        />
      )}
    </nav>
  );
};

export default Nav;
