import { useState, useEffect } from "react";
import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import { toast } from "react-toastify";

/**
 * @description 관리자 인증 상태를 확인하고 관리하는 커스텀 훅
 * @returns {{loading: boolean}} 인증 상태 확인 중 여부
 */
export function useAuth() {
  const { setAdmin } = useAdmin();
  const [loading, setLoading] = useState(true);

  /**
   * @description 관리자 상태를 확인하고 필요시 토큰을 갱신하는 함수
   */
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
        handleAuthError(error);
      }
    }

    setLoading(false); // 모든 경우에 로딩 종료
  };

  /**
   * @description 인증 오류 처리 함수
   * @param {Error} error - 발생한 오류 객체
   */
  const handleAuthError = (error) => {
    toast.error(
      error.message ||
        "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
    );
    localStorage.removeItem("token");
    setAdmin(null);
  };

  useEffect(() => {
    checkAdminStatus();
  }, [setAdmin]);

  return { loading };
}
