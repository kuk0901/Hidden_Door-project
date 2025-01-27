import { useEffect, useState } from "react";
import { Swiper } from "swiper/react";
import "swiper/swiper-bundle.css";
import ThemeSlide from "./ThemeSlide";
import { toast } from "react-toastify";
import Api from "@axios/api";

// FIXME: 데이터 요청하는 비동기 코드 필요, Swiper property 수정
// * theme: imgUrl, route는 recoil 사용해서 관리
const HomeThemeSection = () => {
  // FIXME: slide 적용(swiper)
  const [themeList, setThemeList] = useState([]);

  const handleThemeList = async () => {
    try {
      const res = await Api.get("");

      setThemeList(res.data.data);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    handleThemeList();
  }, []);

  return (
    <section className="theme-section">
      <Swiper
        breakpoints={{
          320: {
            slidesPerView: 1
          },
          640: {
            slidesPerView: 2
          },
          1024: {
            slidesPerView: 3
          }
        }}
        spaceBetween={10}
        pagination={{ clickable: true }}
      >
        {themeList.map((theme) => (
          <ThemeSlide key={theme.id} theme={theme} />
        ))}
      </Swiper>
    </section>
  );
};

export default HomeThemeSection;
