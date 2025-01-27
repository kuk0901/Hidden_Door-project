// import DefaultSection from "@components/common/sections/DefaultSection";
// import BannerImg from "@components/home/BannerImg";
// import HomeThemeSection from "@components/home/HomeThemeSection";
// import Events from "@components/home/Events";
// import Notices from "@components/home/Notices";
import { toast } from "react-toastify";
import Api from "@axios/api";
import { useImgUrl } from "@hooks/useImgUrl";
import { useEffect } from "react";
import { useEscapeRoom } from "@hooks/useEscapeRoom";
// import { useCautionList } from "@hooks/useCautionList";

// * FIXME: 개별 페이지 완성 후 내용 수정
const HomePage = () => {
  // FIXME: 이미지 불러오기 -> 컴포넌트로 분리(atom 사용주의)

  const { escapeRoom, setEscapeRoom } = useEscapeRoom();
  // const { cautionList, setCautionList } = useCautionList();

  const getEscapeRoomInfo = async () => {
    try {
      const res = await Api.get("/api/v1/escape-rooms/info");

      setEscapeRoom({ ...res.data.data });
    } catch (error) {
      toast.error(error.message || "이미지를 불러오는데 실패했습니다.");
    }
  };

  // const getCautionList = async () => {
  //   try {
  //     const res = await Api.get();

  //     setCautionList(res.data.data);
  //   } catch (error) {
  //     toast.error(
  //     error.message ||
  //     "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
  // );
  //   }
  // };

  useEffect(() => {
    getEscapeRoomInfo();
    // getCautionList();
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
      <HomeThemeSection />
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
