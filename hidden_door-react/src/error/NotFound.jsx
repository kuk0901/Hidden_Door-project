import { useNavigate } from "react-router-dom";
import Nav from "@components/common/layout/Nav";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <main className="error-page">
        <h1 className="status-code">404 - Page Not Found</h1>
        <p className="error-msg">요청하신 페이지를 찾을 수 없습니다.</p>
        <div className="btn-container">
          <button onClick={() => navigate("/")} className="btn">
            홈으로 돌아가기
          </button>
        </div>
      </main>
    </>
  );
};

export default NotFound;
