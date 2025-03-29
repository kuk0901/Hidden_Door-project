import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@components/common/layout/Layout";

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
import FaqUpdatePage from "@pages/cs/faq/FaqUpdatePage";
import CustomerPage from "@pages/cs/customer/CustomerPage";
import CustomerAddPage from "@pages/cs/customer/CustomerAddPage";
import CustomerDetailPage from "@pages/cs/customer/CustomerDetailPage";
import ReservationMainPage from "@pages/reservation/ReservationMainPage";
import ReservationConfirmPage from "@pages/reservation/ReservationConfirmPage";
import ReservationSummaryPage from "@pages/reservation/ReservationSummaryPage";
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

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/hidden_door/main" replace />} />

        <Route path="/hidden_door">
          <Route path="main" element={<HomePage />} />

          <Route path="info" element={<EscapeRoomInfoPage />} />

          {/* 테마 페이지 */}
          <Route path="theme">
            <Route index element={<ThemePage />} />
            <Route path=":themeId" element={<ThemeDetailPage />} />
            <Route path="add" element={<ThemeAddPage />} />
          </Route>

          {/* 고객센터 페이지 */}
          <Route path="cs">
            <Route index element={<FaqPage />} />
            <Route path="faq">
              <Route index element={<FaqPage />} />
              <Route path="add" element={<FaqAddPage />} />
              <Route path=":faqId" element={<FaqDetailPage />} />
              <Route path="update/:faqId" element={<FaqUpdatePage />} />
            </Route>
            <Route path="customer">
              <Route index element={<CustomerPage />} />
              <Route path="add" element={<CustomerAddPage />} />
              <Route path=":customerId" element={<CustomerDetailPage />} />
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
            <Route path="confirm" element={<ReservationConfirmPage />} />
            <Route
              path="summary/:reservationNumber"
              element={<ReservationSummaryPage />}
            />
          </Route>

          <Route path="location" element={<LocationPage />} />

          {/* 관리자 전용 페이지 그룹화 */}
          <Route path="admin" element={<ProtectedAdminRoute />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashBoardPage />} />
            <Route path="account">
              <Route index element={<AdminAccountPage />} />
              <Route path=":accountId" element={<AdminAccountDetailPage />} />
            </Route>
            <Route path="reservation">
              <Route index element={<AdminReservationPage />} />
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
  );
}
