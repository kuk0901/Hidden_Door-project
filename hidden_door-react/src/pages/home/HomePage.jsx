import { toast } from "react-toastify";
import Api from "@axios/api";
import { useImgUrl } from "@hooks/useImgUrl";
import { useEffect, useState } from "react";
import { useEscapeRoom } from "@hooks/useEscapeRoom";
import { useAdmin } from "@hooks/useAdmin";
import PresentImageUploader from "@components/common/form/file/PresentImageUploader";
import DefaultSection from "@components/common/sections/DefaultSection";
import HomeThemeSection from "@components/home/HomeThemeSection";
import EventList from "@components/home/EventList";
import CautionSection from "@components/caution/CautionSection";
import HomeSkeleton from "@components/common/loading/skeletonUI/HomeSkeleton";

const HomePage = () => {
  const { escapeRoom, setEscapeRoom } = useEscapeRoom();
  const [loading, setLoading] = useState(true);
  const { admin } = useAdmin();
  const [imgUpdateView, setImgUpdateView] = useState(false);
  const imageUrl = useImgUrl(escapeRoom?.storedFileName);

  const getEscapeRoomInfo = async () => {
    try {
      const res = await Api.get("/escape-rooms/info");

      if (res.status !== 200) {
        toast.error(
          "방탈출 카페 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      } else if (res.data.data === null) {
        return;
      }

      setEscapeRoom({ ...res.data.data });
      setLoading(false);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    getEscapeRoomInfo();
  }, []);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="section--home">
      {/* main img */}
      <section className="main-section__img">
        <div className="guide-container">
          <div className="guide--text">
            {escapeRoom.themeDetailHeaderSubtitle ||
              "방탈출 카페 정보를 추가해주세요."}
          </div>

          <div className="img-container">
            <div
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: "top",
                backgroundSize: "100% 300%"
              }}
              className="image-part top"
            />
            <div
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "100% 300%"
              }}
              className="image-part middle"
            />
            <div
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: "bottom",
                backgroundSize: "100% 300%"
              }}
              className="image-part bottom"
            />
          </div>

          <div className="guide--text">
            {escapeRoom.themeTitle || "방탈출 카페 정보를 추가해주세요."}
          </div>
        </div>

        {admin && (
          <>
            <div className="btn-container">
              <button
                className="btn"
                onClick={() => setImgUpdateView(!imgUpdateView)}
              >
                수정
              </button>
            </div>

            {imgUpdateView && (
              <PresentImageUploader
                escapeRoom={escapeRoom}
                setEscapeRoom={setEscapeRoom}
                onClose={() => setImgUpdateView(false)}
              />
            )}
          </>
        )}
      </section>

      <HomeThemeSection />

      {/* Event */}
      <DefaultSection
        api="/events"
        className="section section--event"
        title="놓치지 마세요!"
        ChildComponent={EventList}
      />

      {/* caution */}
      <CautionSection />
    </div>
  );
};

export default HomePage;
