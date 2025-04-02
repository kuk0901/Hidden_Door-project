import { useState, useEffect } from "react";
import { useAdmin } from "@hooks/useAdmin";
import Api from "@axios/api";
import { tokenManager } from "@token/tokenManager";

export function useAuth() {
  const { setAdmin } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAdminStatus = async () => {
    try {
      const token = tokenManager.getToken();

      if (!token) {
        setIsAuthenticated(false);
        setAdmin(null);
        return;
      }

      const verifyRes = await Api.get("/auth/verify");
      setAdmin(verifyRes.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication error:", error);
      if (error.response && error.response.status === 401) {
        console.error("Authentication error 1:", error);
        try {
          // 토큰 갱신 시도
          const newToken = await tokenManager.refreshToken();
          if (newToken) {
            // 갱신된 토큰으로 다시 인증 시도
            const verifyRes = await Api.get("/auth/verify");
            setAdmin(verifyRes.data.data);
            setIsAuthenticated(true);
            return;
          }
        } catch (refreshError) {
          console.error("Authentication error 2:", error);
          console.error("Token refresh failed:", refreshError);
        }
      }
      setIsAuthenticated(false);
      setAdmin(null);
      tokenManager.removeToken();
      window.location.href = import.meta.env.VITE_APP_ADMIN_LOGIN_PATH;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []); // 의존성 배열에서 setAdmin 제거

  return { loading, isAuthenticated };
}
