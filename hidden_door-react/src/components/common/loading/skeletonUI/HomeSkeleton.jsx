import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CautionSectionSkeleton from "@components/common/loading/skeletonUI/CautionSectionSkeleton";

const HomeSkeleton = () => {
  const [themeSkeletonCount, setThemeSkeletonCount] = useState(3); // Skeleton 개수 상태

  // 화면 크기 감지 함수
  const updateSkeletonCount = () => {
    const width = window.innerWidth;
    if (width <= 474) {
      setThemeSkeletonCount(1);
    } else if (width <= 1024) {
      setThemeSkeletonCount(2);
    }
  };

  useEffect(() => {
    updateSkeletonCount();
    window.addEventListener("resize", updateSkeletonCount);

    return () => {
      window.removeEventListener("resize", updateSkeletonCount);
    };
  }, []);

  return (
    <div className="section--home">
      <div className="guide-container--skeleton">
        <Skeleton
          className="home--img--skeleton"
          baseColor="#666"
          highlightColor="#888"
        />
      </div>

      <section className="theme-slide-section theme-slide-section--skeleton">
        <div className="section--title text-center bold">THEME</div>

        <div className="theme--section--skeleton">
          {/* Skeleton 개수를 동적으로 렌더링 */}
          {Array.from({ length: themeSkeletonCount }).map((_, index) => (
            <Skeleton
              key={index}
              className="theme--slide--skeleton"
              baseColor="#666"
              highlightColor="#888"
            />
          ))}
        </div>
      </section>

      <section className="section--event">
        <div className="section--title text-center bold">이벤트</div>

        <Skeleton height={50} baseColor="#666" highlightColor="#888" />
      </section>

      <CautionSectionSkeleton />
    </div>
  );
};

export default HomeSkeleton;
