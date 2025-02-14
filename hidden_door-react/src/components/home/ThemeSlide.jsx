import { Link } from "react-router-dom";
import { useImgUrl } from "@hooks/useImgUrl";

const ThemeSlide = ({ theme }) => {
  return (
    <div className="theme--slide">
      <img
        src={useImgUrl(theme.storedFileName)}
        alt={theme.themeName}
        className="theme--slide__image"
      />
      <Link
        to={`/hidden_door/theme/${theme.themeId}`}
        className="theme--slide__btn btn--detail"
      >
        자세히 보기
      </Link>
    </div>
  );
};

export default ThemeSlide;
