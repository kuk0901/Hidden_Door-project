import { useEscapeRoom } from "@hooks/useEscapeRoom";
import Header from "@components/common/layout/Header";
import { useEffect, useRef, useState } from "react";
import InfoEditForm from "@components/common/form/InfoEditForm";
import { toast } from "react-toastify";
import Api from "@axios/api";
import ThemeSection from "@components/theme/ThemeSection";
import { useAdmin } from "@hooks/useAdmin";
import { useSearchParams } from "react-router-dom";
import useConfirm from "@hooks/useConfirm";

const ThemePage = () => {
  const { escapeRoom, setEscapeRoom } = useEscapeRoom();
  const { isAdmin } = useAdmin();

  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const [titleDetailVisible, setTitleDetailVisible] = useState(false);
  const titleDetailRef = useRef(null);
  const explanationRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const confirm = useConfirm();

  const handleThemeTitleLineUpdate = async () => {
    const isConfirmed = await confirm(
      `테마 페이지의 제목 부분을 정말로 수정하시겠습니까?`
    );

    if (!isConfirmed) {
      setTitleVisible(false);
      return;
    }

    try {
      const newThemeHeaderTitle = titleRef.current.value;
      const newThemeHeaderSubtitle = subtitleRef.current.value;

      const res = await Api.patch("/escape-rooms/info/theme-title-line", {
        roomId: escapeRoom.roomId,
        themeHeaderTitle: newThemeHeaderTitle,
        themeHeaderSubtitle: newThemeHeaderSubtitle
      });

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
    const isConfirmed = await confirm(
      `테마 페이지의 설명을 정말로 수정하시겠습니까?`
    );

    if (!isConfirmed) {
      setTitleDetailVisible(false);
      return;
    }

    try {
      const newThemeTitle = titleDetailRef.current.value;
      const newThemeExplanation = explanationRef.current.value;

      const res = await Api.patch("/escape-rooms/info/theme-explanation-line", {
        roomId: escapeRoom.roomId,
        themeTitle: newThemeTitle,
        themeExplanation: newThemeExplanation
      });

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

  useEffect(() => {
    if (searchParams.get("register") === "false") {
      toast.warning(
        "새로 추가된 테마를 찾을 수 없습니다. 테마 목록으로 이동합니다."
      );
    } else if (searchParams.get("delete") === "true") {
      toast.success(`${searchParams.get("tn")} 해당 테마가 삭제되었습니다.`);
    }

    setSearchParams({});
  }, []);

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
            id="themeHeaderTitle"
            name="themeHeaderTitle"
          />

          <InfoEditForm
            labelVal="부제목"
            currentTitle={escapeRoom.themeHeaderSubtitle}
            onRef={subtitleRef}
            viewButton={true}
            onUpdate={handleThemeTitleLineUpdate}
            onCancel={() => setTitleVisible(false)}
            id="themeHeaderSubtitle"
            name="themeHeaderSubtitle"
          />
        </>
      )}

      <section className="theme-page--info">
        <p className="theme--title text-center">{escapeRoom.themeTitle}</p>
        <p className="theme--explanation text-center">
          {escapeRoom.themeExplanation}
        </p>
        {isAdmin && (
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
            id="themeTitle"
            name="themeTitle"
          />

          <InfoEditForm
            labelVal="테마 설명"
            currentTitle={escapeRoom.themeExplanation}
            onRef={explanationRef}
            viewButton={true}
            area={true}
            onUpdate={handleThemeDetailUpdate}
            onCancel={() => setTitleDetailVisible(false)}
            id="themeExplanation"
            name="themeExplanation"
          />
        </>
      )}

      <ThemeSection />
    </>
  );
};

export default ThemePage;
