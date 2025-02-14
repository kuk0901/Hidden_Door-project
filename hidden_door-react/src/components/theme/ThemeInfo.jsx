import { formatThemeFieldContent } from "@utils/format/theme";
import LevelIcon from "@components/icon/LevelIcon";

const fieldTranslations = {
  genre: "장르",
  minParticipants: "최소 인원",
  maxParticipants: "최대 인원",
  level: "난이도",
  time: "소요 시간",
  price: "가격(1인당)"
};

const fieldsToDisplay = [
  "genre",
  "time",
  "price",
  "level",
  "minParticipants",
  "maxParticipants"
];

// 난이도 부분 컴포넌트로 변경(icon 사용)
// FaRegStar, FaStar, FaStarHalfAlt
const ThemeInfo = ({ theme }) => {
  const listContent = fieldsToDisplay.map((field) => {
    let content;

    if (field === "level") {
      content = <LevelIcon level={theme[field]} />;
    } else {
      content = Array.isArray(theme[field])
        ? formatThemeFieldContent(field, theme[field].join(", "))
        : formatThemeFieldContent(field, theme[field]);
    }

    return (
      <li key={field} className="theme-info--item">
        <span className="theme-info--item--title">
          {fieldTranslations[field]}
        </span>
        <span className="theme-info--item--content">{content}</span>
      </li>
    );
  });

  return (
    <div className="info--section">
      <ul className="theme-info--list">
        {listContent}

        <li className="theme-info--item theme--description">
          <span className="theme-info--item--title">테마 설명</span>
          <span className="theme-info--item--content">{theme.description}</span>
        </li>
      </ul>
    </div>
  );
};

export default ThemeInfo;
