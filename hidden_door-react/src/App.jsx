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
import FaqAddPage from "@pages/cs/faq/FaqAddPage";
import FaqDetailPage from "@pages/cs/faq/FaqDetailPage";
import CustomerPage from "@pages/cs/customer/CustomerPage";
import ReservationDetailPage from "@pages/reservation/ReservationDetailPage";
import ReservationMainPage from "@pages/reservation/ReservationMainPage";
import EventPage from "@pages/event/EventPage";
import NoticePage from "@pages/notice/NoticePage";
import NoticeDetailPage from "@pages/notice/NoticeDetailPage";
import AddNoticePage from "@pages/notice/AddNoticePage";
import LocationPage from "@pages/location/LocationPage";
import DashBoardPage from "@pages/admin/DashBoardPage";
import AdminReservationPage from "@pages/admin/AdminReservationPage";
import AdminReservationDetailPage from "@pages/admin/AdminReservationDetailPage";
import AdminAccountPage from "@pages/admin/AdminAccountPage";
import AdminAccountDetailPage from "@pages/admin/AdminAccountDetailPage";

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
          "/auth/renew",
          {},
          { withCredentials: true }
        );

        localStorage.setItem("token", res.data.token);

        // 갱신된 액세스 토큰으로 verify 요청
        const verifyRes = await Api.get("/auth/verify", {
          headers: {
            Authorization: `Bearer ${res.data.token}`
          }
        });
        setAdmin(verifyRes.data.data);
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
        const res = await Api.get("/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

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
      const res = await Api.get("/themes/all");

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
  }, [setAdmin]);

  useEffect(() => {
    getAllThemes();
  }, [setThemeList]);

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

            <Route path="/hidden_door">
              <Route path="main" element={<HomePage />} />

              <Route path="info" element={<EscapeRoomInfoPage />} />

              {/* 테마 페이지 */}
              <Route path="theme">
                <Route index element={<ThemePage />} />
                {/* <Route path=":themeId" element={<ThemeDetailPage />} /> */}
                {themeList.length > 0 &&
                  themeList.map((theme) => (
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
                <Route index element={<FaqPage />} />
                <Route path="faq">
                  <Route index element={<FaqPage />} />
                  <Route path="add" element={<FaqAddPage />} />
                  <Route path=":faqId" element={<FaqDetailPage />} />
                </Route>
                <Route path="customer">
                  <Route index element={<CustomerPage />} />
                </Route>
              </Route>

              {/* 이벤트 및 공지사항 페이지 */}
              <Route path="event" element={<EventPage />} />

              <Route path="notice">
                <Route index element={<NoticePage />} />
                <Route path=":id" element={<NoticeDetailPage />} />
                <Route path="add" element={<AddNoticePage />} />
              </Route>

              {/* 예약 페이지 */}
              <Route path="reservation">
                <Route index element={<ReservationMainPage />} />
                <Route
                  path=":reservationId"
                  element={<ReservationDetailPage />}
                />
              </Route>

              <Route path="location" element={<LocationPage />} />

              {/* 관리자 전용 페이지 그룹화 */}
              <Route path="admin" element={<ProtectedAdminRoute />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashBoardPage />} />
                <Route path="account">
                  <Route index element={<AdminAccountPage />} />
                  <Route path=":id" element={<AdminAccountDetailPage />} />
                </Route>
                <Route path="reservation" element={<AdminReservationPage />}>
                  <Route
                    path=":reservationId"
                    element={<AdminReservationDetailPage />}
                  />
                </Route>
              </Route>

              {/* 정책 관련 페이지 그룹화 */}
              <Route path="policy">
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="service" element={<TermsOfService />} />
              </Route>
            </Route>
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
