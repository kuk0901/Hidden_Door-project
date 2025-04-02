import { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@components/common/layout/Layout";

import ProtectedAdminRoute from "@routes/ProtectedAdminRoute";
import HomeSkeleton from "@components/common/loading/skeletonUI/HomeSkeleton";

const HomePage = lazy(() => import("@pages/home/HomePage"));
const LoginPage = lazy(() => import("@pages/admin/LoginPage"));
const PrivacyPolicy = lazy(() => import("@pages/policy/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@pages/policy/TermsOfService"));
const EscapeRoomInfoPage = lazy(() => import("@pages/Info/EscapeRoomInfoPage"));
const ThemePage = lazy(() => import("@pages/theme/ThemePage"));
const ThemeDetailPage = lazy(() => import("@pages/theme/ThemeDetailPage"));
const ThemeAddPage = lazy(() => import("@pages/theme/ThemeAddPage"));
const FaqPage = lazy(() => import("@pages/cs/faq/FaqPage"));
const FaqAddPage = lazy(() => import("@pages/cs/faq/FaqAddPage"));
const FaqDetailPage = lazy(() => import("@pages/cs/faq/FaqDetailPage"));
const FaqUpdatePage = lazy(() => import("@pages/cs/faq/FaqUpdatePage"));
const CustomerPage = lazy(() => import("@pages/cs/customer/CustomerPage"));
const CustomerAddPage = lazy(() =>
  import("@pages/cs/customer/CustomerAddPage")
);
const CustomerDetailPage = lazy(() =>
  import("@pages/cs/customer/CustomerDetailPage")
);
const ReservationMainPage = lazy(() =>
  import("@pages/reservation/ReservationMainPage")
);
const ReservationConfirmPage = lazy(() =>
  import("@pages/reservation/ReservationConfirmPage")
);
const ReservationSummaryPage = lazy(() =>
  import("@pages/reservation/ReservationSummaryPage")
);
const EventPage = lazy(() => import("@pages/event/EventPage"));
const NoticePage = lazy(() => import("@pages/notice/NoticePage"));
const NoticeDetailPage = lazy(() => import("@pages/notice/NoticeDetailPage"));
const AddNoticePage = lazy(() => import("@pages/notice/AddNoticePage"));
const LocationPage = lazy(() => import("@pages/location/LocationPage"));
const DashBoardPage = lazy(() => import("@pages/admin/DashBoardPage"));
const AdminReservationPage = lazy(() =>
  import("@pages/admin/AdminReservationPage")
);
const AdminReservationDetailPage = lazy(() =>
  import("@pages/admin/AdminReservationDetailPage")
);
const AdminAccountPage = lazy(() => import("@pages/admin/AdminAccountPage"));
const AdminAccountDetailPage = lazy(() =>
  import("@pages/admin/AdminAccountDetailPage")
);
const NotFound = lazy(() => import("@error/NotFound"));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/hidden_door/main" replace />} />

        <Route path="/hidden_door">
          <Route
            path="main"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <HomePage />
              </Suspense>
            }
          />

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
