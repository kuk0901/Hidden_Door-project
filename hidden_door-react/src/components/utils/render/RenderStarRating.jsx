import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RenderStarRatingIcon = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="rating--star">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} color="yellow" className="star" />
      ))}
      {hasHalfStar && <FaStarHalfAlt color="yellow" className="star" />}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} color="yellow" className="star" />
      ))}
    </div>
  );
};

export default RenderStarRatingIcon;
