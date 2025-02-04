import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ThemeSlide from "@components/home/ThemeSlide";
import { useThemeList } from "@hooks/useThemeList";

const HomeThemeSection = () => {
  const { themeList } = useThemeList();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1378,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 998,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 625,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <section className="theme-slide-section">
      <Slider {...settings}>
        {themeList.map((item) => (
          <div key={item.themeId}>
            <ThemeSlide theme={item} />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HomeThemeSection;
