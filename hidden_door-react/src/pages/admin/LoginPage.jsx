import SigninForm from "@components/common/auth/SigninForm";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [hasShownSignoutMessage, setHasShownSignoutMessage] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.get("signout") === "true" && !hasShownSignoutMessage) {
      toast.success("로그아웃 되었습니다."); // 로그아웃
      setHasShownSignoutMessage(true); // 메시지 표시 후 상태 업데이트
    }
  }, [hasShownSignoutMessage]);

  return (
    <div>
      <div className="border-gray"></div>
      <div className="border-gray container login_container">
        <SigninForm />
      </div>
    </div>
  );
};

export default LoginPage;
