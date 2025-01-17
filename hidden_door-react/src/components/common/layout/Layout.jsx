import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@components/common/layout/header";
import Footer from "@components/common/layout/Footer";

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
      <Footer />
    </div>
  );
};

export default Layout;
