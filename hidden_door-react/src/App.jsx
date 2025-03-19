import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import Confirm from "@components/common/dialogs/Confirm";
import Loading from "@components/common/loading/Loading";
import { AppRoutes } from "@routes/AppRoutes";
import { useAuth } from "@hooks/useAuth";

import { useScrollRestoration } from "@hooks/useScrollRestoration";

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
      <Suspense fallback={<Loading />}>
        <AppRoutes />
      </Suspense>
    </>
  );
}

export default App;
