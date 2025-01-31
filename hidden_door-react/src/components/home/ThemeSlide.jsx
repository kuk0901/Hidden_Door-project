import { SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

// FIXME: 실제 dto에 맞춰 수정
const ThemeSlide = ({ theme }) => {
  return (
    <SwiperSlide className="theme-slide">
      <img src={theme.imgUrl} alt={theme.themeName} className="theme-slide__image" />
      <Link to={theme.detailRoute} className="theme-slide__btn btn--detail"></Link>
    </SwiperSlide>
  );
};

export default ThemeSlide;
