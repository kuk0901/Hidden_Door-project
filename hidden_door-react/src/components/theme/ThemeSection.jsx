import { useThemeList } from "@hooks/useThemeList";
import Theme from "@components/theme/Theme";
import { Link } from "react-router-dom";
import { useAdmin } from "@hooks/useAdmin";

const ThemeSection = () => {
  const { themeList } = useThemeList();
  const { admin } = useAdmin();

  return (
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
          {themeList.map((theme) => (
            <Theme key={theme.themeId} theme={theme} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ThemeSection;
