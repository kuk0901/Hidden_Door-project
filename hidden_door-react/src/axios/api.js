import axios from "axios";

const Api = axios.create({
  baseURL: "/api"
});

/**
 * @description 요청 인터셉터를 설정하여 모든 요청에 Authorization 헤더를 추가
 */
// FIXME: accessToken 만료 후의 refreshToken 자동 업데이트 유무 체크
Api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
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
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const errorRes = error.response;

      const accessDeniedResult =
        errorRes.status === 401 && errorRes.data.code === "ACCESS_DENIED";

      if (accessDeniedResult && !originalRequest._retry) {
        originalRequest._retry = true; // 재시도 방지 플래그 설정

        try {
          // Refresh Token 요청
          const refreshResponse = await Api.post(
            "/api/auth/renew",
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshResponse.data.token;

          localStorage.setItem("token", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return Api(originalRequest);
        } catch (refreshError) {
          if (
            refreshError.response &&
            refreshError.response.data.code === "REFRESH_TOKEN_EXPIRED"
          ) {
            localStorage.removeItem("token");
            window.location.href = import.meta.env.VITE_APP_ADMIN_LOGIN_PATH;
          } else {
            return Promise.reject(
              new Error("리프레시 토큰 요청 중 오류가 발생했습니다.")
            );
          }
        }
      }

      return Promise.reject(
        new Error(errorRes.data.msg || "알 수 없는 오류가 발생했습니다.")
      );
    } else if (error.request) {
      // 요청은 했지만 응답이 없는 경우
      return Promise.reject(new Error("서버와의 연결에 문제가 발생했습니다."));
    } else {
      // 다른 오류
      return Promise.reject(
        new Error(error.message || "알 수 없는 오류가 발생했습니다.")
      );
    }
  }
);

export default Api;
