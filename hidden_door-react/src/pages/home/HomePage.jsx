import DefaultSection from "@components/common/sections/DefaultSection";
import BannerImg from "@components/home/BannerImg";
import ThemeSection from "@components/home/ThemeSection";
import Events from "@components/home/Events";
import Notices from "@components/home/Notices";

// * FIXME: 개별 페이지 완성 후 내용 수정
const HomePage = () => {
  return (
    <>
      <div
        style={{
          border: "1px solid white",
          height: "400px",
          marginBottom: "10px"
        }}
      ></div>

      <div
        style={{
          border: "1px solid white",
          height: "300px",
          marginBottom: "10px"
        }}
      ></div>

      <div
        style={{
          border: "1px solid white",
          height: "300px",
          marginBottom: "10px"
        }}
      ></div>

      <div
        style={{
          border: "1px solid white",
          height: "300px",
          marginBottom: "10px"
        }}
      ></div>

      {/* <DefaultSection
        api="/api/v1/banner"
        className="banner-section"
        Component={BannerImg}
      />
      <ThemeSection />
      <DefaultSection
        api="/api/v1/events"
        className="event-section"
        title="놓치지마세요!"
        Component={Events}
      />
      <DefaultSection
        api="/api/v1/notices"
        className="notice-section"
        title="notice"
        Component={Notices}
      /> */}
    </>
  );
};

export default HomePage;
