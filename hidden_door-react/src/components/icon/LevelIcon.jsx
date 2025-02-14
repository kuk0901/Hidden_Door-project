import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const LevelIcon = ({ level }) => {
  const maxStars = 5;
  const fullStars = Math.floor(level);
  const halfStar = level % 1 > 0;

  return (
    <span className="level-icon">
      {[...Array(maxStars)].map((_, index) => {
        if (index < fullStars) {
          return <FaStar key={index} className="level" />;
        } else if (index === fullStars && halfStar) {
          return <FaStarHalfAlt key={index} className="level" />;
        } else {
          return <FaRegStar key={index} className="level" />;
        }
      })}
    </span>
  );
};

export default LevelIcon;
