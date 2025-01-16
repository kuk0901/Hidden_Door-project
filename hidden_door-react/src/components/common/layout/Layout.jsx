import { Outlet, useNavigate } from "react-router-dom";
import Header from "@components/common/layout/header";
import { useEffect } from "react";

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/hidden_door/main");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
