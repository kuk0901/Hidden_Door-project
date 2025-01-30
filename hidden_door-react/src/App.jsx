import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import HomePage from '@pages/home/HomePage';
import LoginPage from '@pages/admin/LoginPage';
import Confirm from '@components/common/Confirm';
import Loading from '@components/common/loading/Loading';
import Layout from '@components/common/layout/Layout';

import EventPage from '@pages/event/EventPage';
import NoticePage from '@pages/notice/NoticePage';

import { useAdmin } from '@hooks/useAdmin';
import Api from '@axios/api';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import { getCookie } from './cookie/getCookie';

function App() {
  const { setAdmin } = useAdmin();
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async () => {
    const token = localStorage.getItem('token');
    const refreshToken = getCookie('refreshToken');

    if (!token && refreshToken) {
      try {
        const res = await Api.post(
          '/api/v1/auth/renew',
          {},
          { withCredentials: true }
        );
        localStorage.setItem('token', res.data.token);
        setAdmin(res.data.data);
      } catch (error) {
        toast.error(
          error.response?.data.msg ||
            '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
        );
        localStorage.removeItem('token');
        setAdmin(null);
      }
    } else if (token) {
      try {
        const res = await Api.get('/api/v1/auth/verify');
        setAdmin(res.data.data);
      } catch (error) {
        toast.error(
          error.response?.data.msg ||
            '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
        );
        localStorage.removeItem('token');
        setAdmin(null);
      }
    } else {
      // 토큰과 리프레시 토큰 모두 없을 때
      setAdmin(null);
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
            <Route path="/hidden_door/main" element={<HomePage />} />
            <Route path="/hidden_door/event" element={<EventPage />} />{' '}
            {/* 이벤트 페이지 */}
            <Route path="/Hidden_door/notice" element={<NoticePage />}></Route>
            <Route path="/hidden_door/admin" element={<ProtectedAdminRoute />}>
              {/* 관리자 전용 페이지들 */}
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
