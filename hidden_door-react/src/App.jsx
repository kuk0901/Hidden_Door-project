import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confirm from "@components/common/dialogs/Confirm";
import Loading from "@components/common/loading/Loading";
import { AppRoutes } from "@routes/AppRoutes";
import { useAuth } from "@hooks/useAuth";
import { useScrollRestoration } from "@hooks/useScrollRestoration";
import InputConfirm from "./components/common/dialogs/inputConfirm";

function App() {
  const { loading } = useAuth();
  useScrollRestoration();

  if (loading) return <Loading />;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Confirm />
      <InputConfirm />
      <Suspense fallback={<Loading />}>
        <AppRoutes />
      </Suspense>
    </>
  );
}

export default React.memo(App); // React.memo를 사용하여 불필요한 리렌더링 방지
