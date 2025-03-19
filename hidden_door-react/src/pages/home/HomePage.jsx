import { toast } from "react-toastify";
import Api from "@axios/api";
import { useImgUrl } from "@hooks/useImgUrl";
import { useEffect, useState } from "react";
import { useEscapeRoom } from "@hooks/useEscapeRoom";
import { useAdmin } from "@hooks/useAdmin";
import PresentImageUploader from "@components/common/form/file/PresentImageUploader";
import DefaultSection from "@components/common/sections/DefaultSection";
import CautionList from "@components/caution/CautionList";
import HomeThemeSection from "@components/home/HomeThemeSection";

// * FIXME: 개별 페이지 완성 후 내용 수정
const HomePage = () => {
  const { escapeRoom, setEscapeRoom } = useEscapeRoom();
  const { admin } = useAdmin();
  const [imgUpdateView, setImgUpdateView] = useState(false);

  const getEscapeRoomInfo = async () => {
    try {
      const res = await Api.get("/escape-rooms/info");

      setEscapeRoom({ ...res.data.data });
    } catch (error) {
      toast.error(error.message || "이미지를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    getEscapeRoomInfo();
  }, []);

  return (
    <>
      {/* main img */}
      <section className="main-section__img">
        <div className="guide-container">
          <div className="guide--text">
            {escapeRoom.themeDetailHeaderSubtitle}
          </div>

          <div className="img-container">
            <div
              style={{
                backgroundImage: `url(${useImgUrl(escapeRoom.storedFileName)})`,
                backgroundPosition: "top",
                backgroundSize: "100% 300%"
              }}
              className="image-part top"
            />
            <div
              style={{
                backgroundImage: `url(${useImgUrl(escapeRoom.storedFileName)})`,
                backgroundPosition: "center",
                backgroundSize: "100% 300%"
              }}
              className="image-part middle"
            />
            <div
              style={{
                backgroundImage: `url(${useImgUrl(escapeRoom.storedFileName)})`,
                backgroundPosition: "bottom",
                backgroundSize: "100% 300%"
              }}
              className="image-part bottom"
            />
          </div>

          <div className="guide--text">{escapeRoom.themeTitle}</div>
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

      {/* FIXME: Event section 추가 */}

      {/* <div 
        style={{
          border: "1px solid white",
          height: "300px",
          marginBottom: "10px",
          textAlign: "center"
        }}
      >
        Event section
      </div> */}

      {/* caution */}
      <DefaultSection
        api="/cautions/list"
        className="section section--caution"
        title="주의사항"
        ChildComponent={CautionList}
      />
    </>
  );
};

export default HomePage;
