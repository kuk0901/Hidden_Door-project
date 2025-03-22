import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * @description 페이지 전환 시 스크롤 위치를 최상단으로 복원하는 커스텀 훅
 */
export function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);
}
