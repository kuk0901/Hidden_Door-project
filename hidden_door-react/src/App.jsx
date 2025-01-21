import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "@pages/home/HomePage";
import LoginPage from "@pages/admin/LoginPage";
import Confirm from "@components/common/dialogs/Confirm";
import Loading from "@components/common/loading/Loading";
import Layout from "@components/common/layout/Layout";

import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import PrivacyPolicy from "@pages/policy/PrivacyPolicy";
import TermsOfService from "@pages/policy/TermsOfService";
import EscapeRoomInfoPage from "./pages/Info/EscapeRoomInfoPage";

// FIXME: Theme -> 동적 라우팅을 위해 데이터를 가져온 후 Route 생성 -> ThemeDetail이라는 페이지로 theme 정보 담긴 item 전달
function App() {
  const { setAdmin } = useAdmin();
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Access Token이 없을 때 리프레시 토큰으로 로그인 상태 확인
      try {
        const res = await Api.post(
          "/api/v1/auth/renew",
          {},
          { withCredentials: true }
        );
        localStorage.setItem("token", res.data.token);
        setAdmin(res.data.data);
      } catch (error) {
        toast.error(
          error.message ||
            "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        localStorage.removeItem("token");
        setAdmin(null);
      }
    } else {
      // Access Token이 있을 때 유효성 검사
      try {
        const res = await Api.get("/api/v1/auth/verify");
        setAdmin(res.data.data);
      } catch (error) {
        toast.error(
          error.message ||
            "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        localStorage.removeItem("token");
        setAdmin(null);
      }
    }

    setLoading(false); // 모든 경우에 로딩 종료
  };

  useEffect(() => {
    checkAdminStatus();
  }, [setAdmin]);

  if (loading) return <Loading />; // 로딩 중일 때 로딩 컴포넌트 표시

  return (
    <>
      <ToastContainer
        position="top-right" // 알람 위치 지정
        autoClose={3000} // 자동 off 시간
        hideProgressBar={false} // 진행시간바 숨김
        closeOnClick // 클릭으로 알람 닫기
        rtl={false} // 알림 좌우 반전
        pauseOnFocusLoss // 화면을 벗어나면 알람 정지
        draggable // 드래그 가능
        pauseOnHover // 마우스를 올리면 알람 정지
        theme="light"
      />
      <Confirm />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={<Navigate to="/hidden_door/main" replace />}
            />

            {/* 사용자, 관리자 공통 페이지 그룹화 */}
            <Route path="/hidden_door">
              <Route path="main" element={<HomePage />} />
              <Route path="info" element={<EscapeRoomInfoPage />} />
            </Route>

            {/* 정책 관련 페이지 그룹화 */}
            <Route path="/hidden_door/policy">
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="service" element={<TermsOfService />} />
            </Route>

            {/* 관리자 전용 페이지 그룹화 */}
            <Route
              path="/hidden_door/admin"
              element={<ProtectedAdminRoute />}
            ></Route>
          </Route>

          <Route
            path={import.meta.env.VITE_APP_ADMIN_LOGIN_PATH}
            element={<LoginPage />}
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
