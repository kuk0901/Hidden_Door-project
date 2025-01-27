import { useEscapeRoom } from "@hooks/useEscapeRoom";
import Header from "@components/common/layout/Header";
import { useRef, useState } from "react";
import InfoEditForm from "@components/common/form/InfoEditForm";
import { toast } from "react-toastify";
import Api from "@axios/api";
import ThemeSection from "@components/theme/ThemeSection";
import { useAdmin } from "@hooks/useAdmin";

const ThemePage = () => {
  const { escapeRoom, setEscapeRoom } = useEscapeRoom();
  const { admin } = useAdmin();

  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const [titleDetailVisible, setTitleDetailVisible] = useState(false);
  const titleDetailRef = useRef(null);
  const explanationRef = useRef(null);

  const handleThemeTitleLineUpdate = async () => {
    try {
      const newThemeHeaderTitle = titleRef.current.value;
      const newThemeHeaderSubtitle = subtitleRef.current.value;

      const res = await Api.patch(
        "/api/v1/escape-rooms/info/theme-title-line",
        {
          roomId: escapeRoom.roomId,
          themeHeaderTitle: newThemeHeaderTitle,
          themeHeaderSubtitle: newThemeHeaderSubtitle
        }
      );

      setEscapeRoom(res.data.data);

      toast.success("제목과 부제목이 성공적으로 수정되었습니다.");
      setTitleVisible(false);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  const handleThemeDetailUpdate = async () => {
    try {
      const newThemeTitle = titleDetailRef.current.value;
      const newThemeExplanation = explanationRef.current.value;

      console.log(newThemeTitle);
      console.log(newThemeExplanation);

      const res = await Api.patch(
        "/api/v1/escape-rooms/info/theme-explanation-line",
        {
          roomId: escapeRoom.roomId,
          themeTitle: newThemeTitle,
          themeExplanation: newThemeExplanation
        }
      );

      console.log(res.data.data);

      setEscapeRoom(res.data.data);

      toast.success("테마 정보가 성공적으로 수정되었습니다.");
      setTitleDetailVisible(false);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <>
      <Header
        title={escapeRoom.themeHeaderTitle}
        subtitle={escapeRoom.themeHeaderSubtitle}
        text="제목 수정"
        reservation={true}
        handleUpdate={() => setTitleVisible(!titleVisible)}
      />

      {titleVisible && (
        <>
          <InfoEditForm
            labelVal="제목"
            currentTitle={escapeRoom.themeHeaderTitle}
            onRef={titleRef}
            autoFocus={true}
          />

          <InfoEditForm
            labelVal="부제목"
            currentTitle={escapeRoom.themeHeaderSubtitle}
            onRef={subtitleRef}
            viewButton={true}
            onUpdate={handleThemeTitleLineUpdate}
            onCancel={() => setTitleVisible(false)}
          />
        </>
      )}

      <section className="theme-page--info">
        <p className="theme--title text-center">{escapeRoom.themeTitle}</p>
        <p className="theme--explanation text-center">
          {escapeRoom.themeExplanation}
        </p>
        {admin && (
          <div className="btn-container">
            <button
              className="btn"
              onClick={() => setTitleDetailVisible(!titleDetailVisible)}
            >
              수정
            </button>
          </div>
        )}
      </section>

      {titleDetailVisible && (
        <>
          <InfoEditForm
            labelVal="테마 제목"
            currentTitle={escapeRoom.themeTitle}
            onRef={titleDetailRef}
            autoFocus={true}
          />

          <InfoEditForm
            labelVal="테마 설명"
            currentTitle={escapeRoom.themeExplanation}
            onRef={explanationRef}
            viewButton={true}
            area={true}
            onUpdate={handleThemeDetailUpdate}
            onCancel={() => setTitleDetailVisible(false)}
          />
        </>
      )}

      <ThemeSection />
    </>
  );
};

export default ThemePage;
