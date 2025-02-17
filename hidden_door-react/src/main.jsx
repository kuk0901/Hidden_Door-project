import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

function addScript(src) {
  const script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
}

addScript(
  `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
    import.meta.env.VITE_APP_KAKAO_JS_KEY
  }&libraries=services,clusterer&autoload=false`
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 8 * 60 * 60 * 1000, // 8시간
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </RecoilRoot>
    </BrowserRouter>
  </StrictMode>
);
