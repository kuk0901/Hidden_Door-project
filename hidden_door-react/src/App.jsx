import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Confirm from "@components/common/dialogs/Confirm";
import Loading from "@components/common/loading/Loading";
import Layout from "@components/common/layout/Layout";

import { useAdmin } from "@hooks/useAdmin";
import { useThemeList } from "@hooks/useThemeList";
import Api from "@axios/api";
import ProtectedAdminRoute from "@routes/ProtectedAdminRoute";

import HomePage from "@pages/home/HomePage";
import LoginPage from "@pages/admin/LoginPage";
import PrivacyPolicy from "@pages/policy/PrivacyPolicy";
import TermsOfService from "@pages/policy/TermsOfService";
import EscapeRoomInfoPage from "@pages/Info/EscapeRoomInfoPage";
import ThemePage from "@pages/theme/ThemePage";
import ThemeDetailPage from "@pages/theme/ThemeDetailPage";
import ThemeAddPage from "@pages/theme/ThemeAddPage";
import FaqPage from "@pages/cs/faq/FaqPage";
import CustomerPage from "@pages/cs/customer/CustomerPage";
import ReservationPage from "@pages/reservation/ReservationPage";
import EventPage from "@pages/event/EventPage";
import NoticePage from "@pages/notice/NoticePage";

function App() {
  const { setAdmin } = useAdmin();
  const [loading, setLoading] = useState(true);
  const { themeList, setThemeList } = useThemeList();

  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, [location.pathname]); // 라우트 변경 시마다 실행

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

  const getAllThemes = async () => {
    try {
      const res = await Api.get("/api/v1/themes/all");

      setThemeList(res.data.data);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    checkAdminStatus();
    getAllThemes();
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

              <Route path="theme">
                <Route index element={<ThemePage />} />
                {themeList.map((theme) => (
                  <Route
                    key={theme.themeId}
                    path={theme.themeId}
                    element={<ThemeDetailPage theme={theme} />}
                  />
                ))}
                <Route path="add" element={<ThemeAddPage />} />
              </Route>

              {/* 고객센터 페이지 */}
              <Route path="cs">
                <Route path="faq" element={<FaqPage />} />
                <Route path="customer" element={<CustomerPage />} />
              </Route>

              {/* 이벤트 및 공지사항 페이지 */}
              <Route path="event" element={<EventPage />} />
              <Route path="notice" element={<NoticePage />}></Route>

              <Route path="reservation" element={<ReservationPage />} />
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
