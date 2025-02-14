import SigninForm from "@components/common/auth/SigninForm";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { GiDoor } from "react-icons/gi";

const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("signout") === "true") {
      toast.success("로그아웃 되었습니다.");
    }

    setSearchParams({});
  }, []);

  return (
    <div>
      <h1 className="title italic bold text-center">Hidden_Door 관리자</h1>
      <div className="container login-section">
        <section className="login-img-container">
          <GiDoor size={400} className="login-icon" />
        </section>
        <section className="login-form-container">
          <h2 className="text-center">&quot;Admin Login&quot;</h2>
          <SigninForm />
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
