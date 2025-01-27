import { Link } from "react-router-dom";
import { useImgUrl } from "@hooks/useImgUrl";

const Theme = ({ theme }) => {
  return (
    <li className="theme--item">
      <div className="img-container">
        <img
          src={`${useImgUrl(theme.storedFileName)}`}
          alt={theme.themeName}
          className="img"
        />
      </div>

      <div className="btn-container">
        <Link to={`/hidden_door/theme/${theme.themeId}`} className="btn">
          상세보기
        </Link>
        <Link to="#" className="btn">
          예약하기
        </Link>
      </div>
    </li>
  );
};

export default Theme;
