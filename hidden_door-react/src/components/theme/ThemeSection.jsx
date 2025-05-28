import Theme from "@components/theme/Theme";
import { Link } from "react-router-dom";
import { useAdmin } from "@hooks/useAdmin";
import { toast } from "react-toastify";
import Api from "@axios/api";
import { useEffect, useState } from "react";
import ThemeSectionSkeleton from "@components/common/loading/skeletonUI/ThemeSectionSkeleton";

const ThemeSection = () => {
  const [themeList, setThemeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSummeryThemeList = async () => {
    try {
      const res = await Api.get("/themes/summary");

      if (res.status !== 200) {
        toast.error(
          "테마 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        );
      }

      setThemeList(res.data?.data);
      setLoading(false);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };
  const { admin } = useAdmin();

  useEffect(() => {
    getSummeryThemeList();
  }, []);

  return loading ? (
    <ThemeSectionSkeleton />
  ) : (
    <section className="theme-section">
      {admin && (
        <div className="btn-link-container">
          <Link to="/hidden_door/theme/add" className="btn btn--link">
            테마 추가
          </Link>
        </div>
      )}

      <div className="theme-page--theme-section">
        <ul className="theme--list">
          {themeList?.map((theme) => (
            <Theme key={theme.themeId} theme={theme} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ThemeSection;
