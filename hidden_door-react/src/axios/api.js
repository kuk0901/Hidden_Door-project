import axios from "axios";
import { tokenManager } from "@token/tokenManager";

const Api = axios.create({
  baseURL: "/api"
});

/**
 * @description 요청 인터셉터를 설정하여 모든 요청에 Authorization 헤더를 추가
 */
// FIXME: accessToken 만료 후의 refreshToken 자동 업데이트 동작 확인 필요
Api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message || "Request failed"));
  }
);

/**
 * @description 응답 인터셉터를 설정하여 401 상태 코드 처리 및 Access Token 갱신
 */
Api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["New-Access"];
    if (newToken) {
      tokenManager.setToken(newToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await tokenManager.refreshToken();
        Api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
        return Api(originalRequest);
      } catch (error) {
        console.log(error);

        // 리프레시 토큰도 만료되었거나 갱신에 실패한 경우
        tokenManager.removeToken();

        if (originalRequest.url !== "/auth/terminate") {
          window.location.href = import.meta.env.VITE_APP_ADMIN_LOGIN_PATH;
        }
      }
    }
    return Promise.reject(new Error(error.message || "response failed"));
  }
);

export default Api;
