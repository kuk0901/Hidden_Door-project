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
      setIsAuthenticated(false);
      setAdmin(null);
      tokenManager.removeToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []); // 의존성 배열에서 setAdmin 제거

  return { loading, isAuthenticated };
}
