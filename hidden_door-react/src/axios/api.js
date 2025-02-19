import axios from "axios";

const Api = axios.create({
  baseURL: "/api"
});

// * 요청 인터셉터
Api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token"); // Access Token 가져옴
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // 헤더에 Access Token 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message || "Request failed"));
  }
);

// * 응답 인터셉터
Api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // error.response가 정의되어 있는지 확인
    if (error.response) {
      const errorRes = error.response;

      // 401 상태 코드와 ACCESS_DENIED 코드 확인
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

          const newAccessToken = refreshResponse.data.token; // 새로운 Access Token

          localStorage.setItem("token", newAccessToken); // 새로운 Access Token 저장
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; // 재요청 시 새로운 Access Token 추가

          return Api(originalRequest); // 원래 요청 다시 전송
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
