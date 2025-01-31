import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Nav from "@components/common/layout/Nav";
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
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
