import Api from "@axios/api";

let isRefreshing = false;
let refreshPromise = null;

export const tokenManager = {
  async refreshToken() {
    if (isRefreshing) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = this.doRefreshToken();

    try {
      const newToken = await refreshPromise;
      return newToken;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  },

  async doRefreshToken() {
    try {
      const res = await Api.post(
        "/auth/renew",
        {},
        { withCredentials: true, headers: { "X-Refresh-Token": "true" } }
      );

      const newToken = res.data.token;

      if (!newToken) {
        throw new Error("No token received from server");
      }

      this.setToken(newToken);

      return newToken;
    } catch (error) {
      console.error("Token refresh failed: ", error);
      this.removeToken();
      throw error;
    }
  },

  getToken() {
    return localStorage.getItem("token");
  },

  setToken(token) {
    localStorage.setItem("token", token);
  },

  removeToken() {
    localStorage.removeItem("token");
  }
};
