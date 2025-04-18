import axios from "axios";
import { tokenManager } from "@token/tokenManager";

const Api = axios.create({
  baseURL: "/api"
});

/**
 * @description 요청 인터셉터를 설정하여 모든 요청에 Authorization 헤더를 추가
 */

Api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("요청 인터셉터 에러 발생");
    return Promise.reject(new Error(error.message || "Request failed"));
  }
);

/**
 * @description 응답 인터셉터를 설정하여 401 상태 코드 처리 및 Access Token 갱신
 */
Api.interceptors.response.use(
  (response) => {
    if (response.headers["token-refreshed"] === "true") {
      const newToken = response.headers["authorization"];
      if (newToken?.startsWith("Bearer ")) {
        const token = newToken.slice(7);
        tokenManager.setToken(token);

        delete response.headers["Token-Refreshed"];
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.headers["token-expired"] === "true" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await tokenManager.refreshToken();
        Api.defaults.headers.common["authorization"] = "Bearer " + newToken;
        delete error.response.headers["Token-Expired"];
        return Api(originalRequest);
      } catch (error) {
        console.error("Token refresh failed:", error);
        tokenManager.removeToken();
        window.location.href = import.meta.env.VITE_APP_ADMIN_LOGIN_PATH;
      }
    }
    const { msg } = error.response?.data ?? {};
    const message = (msg || error.message || "response failed").trim();

    return Promise.reject(new Error(message));
  }
);

export default Api;
