import Api from "@axios/api";

let isRefreshing = false;
let refreshPromise = null;

export const tokenManager = {
  async refreshToken() {
    if (isRefreshing) {
      console.log("Token is refreshing. Waiting for completion...");
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = Api.post("/auth/renew", {}, { withCredentials: true })
      .then((response) => {
        console.log("Token refreshed:", response.data);
        const newToken = response.data.token;
        if (!newToken) {
          throw new Error("No token received from server");
        }
        this.setToken(newToken);
        return newToken;
      })
      .catch((error) => {
        console.error("Token refresh failed:", error);
        this.removeToken();
        throw error;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });

    return refreshPromise;
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
