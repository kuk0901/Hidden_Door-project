// import DefaultSection from "@components/common/sections/DefaultSection";
// import BannerImg from "@components/home/BannerImg";
// import ThemeSection from "@components/home/ThemeSection";
// import Events from "@components/home/Events";
// import Notices from "@components/home/Notices";
import { toast } from "react-toastify";
import Api from "@axios/api";
import { useRecoilState } from "recoil";
import { escapeRoomState } from "@atoms/escapeRoomAtom";
import { useImgUrl } from "@hooks/useImgUrl";
import { useEffect } from "react";
import { useEscapeRoom } from "@hooks/useEscapeRoom";

// * FIXME: 개별 페이지 완성 후 내용 수정
const HomePage = () => {
  // FIXME: 이미지 불러오기 -> 컴포넌트로 분리(atom 사용주의)

  const { escapeRoom, setEscapeRoom } = useEscapeRoom();

  const getEscapeRoomInfo = async () => {
    try {
      const res = await Api.get("/api/v1/escape-rooms/info");

      setEscapeRoom({ ...res.data.data });
    } catch (error) {
      console.error(error);
      toast.error("이미지를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    getEscapeRoomInfo();
  }, []);

  return (
    <>
      {/* main img */}
      {/* FIXME: css 수정 필요 */}
      <section className="main-section__img">
        <img
          src={`${useImgUrl(escapeRoom.storedFileName)}`}
          alt={escapeRoom.originalFileName}
        />
      </section>

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
