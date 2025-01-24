import { useEscapeRoom } from "@hooks/useEscapeRoom";
import Header from "@components/common/layout/Header";
import { useRef, useState } from "react";
import InfoEditForm from "@components/common/form/InfoEditForm";
import { toast } from "react-toastify";
import Api from "@axios/api";
import ThemeSection from "@components/theme/ThemeSection";

const ThemePage = () => {
  const { escapeRoom, setEscapeRoom } = useEscapeRoom();
  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

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
      toast.error(error.message || "알 수 없는 오류가 발생했습니다.");
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

      <ThemeSection />
    </>
  );
};

export default ThemePage;
