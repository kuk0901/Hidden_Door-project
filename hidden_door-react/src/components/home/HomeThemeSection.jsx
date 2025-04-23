import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ThemeSlide from "@components/home/ThemeSlide";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Api from "@axios/api";

const HomeThemeSection = () => {
  const [themeList, setThemeList] = useState([]);

  const getSummeryThemeList = async () => {
    try {
      const res = await Api.get("/themes/summary");

      if (res.status !== 200) {
        toast.error(
          "테마 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        );
      }

      setThemeList(res.data.data);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    initialSlide: 0,
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
      }
    ]
  };

  useEffect(() => {
    getSummeryThemeList();
  }, []);

  return (
    <section className="theme-slide-section">
      <div className="section--title text-center bold">THEME</div>

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
