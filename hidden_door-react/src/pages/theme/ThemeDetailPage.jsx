import { useEffect } from "react";
import { toast } from "react-toastify";

const ThemeDetailPage = ({ theme }) => {
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.get("register") === "true") {
      toast.success("작성하신 테마 정보가 추가되었습니다.");
    }
  }, []);
  return (
    <div>
      <h1>{theme.themeName}</h1>
      {/* 테마 상세 정보 렌더링 */}
    </div>
  );
};

export default ThemeDetailPage;
