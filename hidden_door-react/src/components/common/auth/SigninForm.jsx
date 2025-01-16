import { useNavigate } from "react-router-dom";
import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import Form from "@components/common/form/Form";
import { toast } from "react-toastify";
import { useState } from "react";
import Loading from "../loading/Loading";

const SigninForm = () => {
  const { setAdmin } = useAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "your@email.com",
      className: "m",
      id: "email",
      label: "이메일"
    },
    {
      name: "pwd",
      type: "password",
      placeholder: "********",
      className: "m",
      id: "pwd",
      label: "패스워드"
    }
  ];

  const onSubmit = async (data, reset) => {
    try {
      setLoading(true);

      const res = await Api.post("/api/v1/auth/authenticate", {
        email: data.email,
        pwd: data.pwd
      });

      const accessToken = res.data.token;
      const userInfoData = res.data.data;

      localStorage.setItem("token", accessToken);
      setAdmin(userInfoData);

      navigate("/hidden_door/main");
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
      reset();
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return <Form onSubmit={onSubmit} fields={fields} btnText="로그인" />;
};

export default SigninForm;
