import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useEscapeRoom } from "@hooks/useEscapeRoom";
import Header from "@components/common/layout/Header";
import InfoEditForm from "@components/common/form/infoEditForm";
import Api from "@axios/api";
import ThemeDetail from "@components/theme/ThemeDetail";
import { useSearchParams } from "react-router-dom";
import OneThemePriceSection from "@components/price/OneThemePriceSection";
import useConfirm from "@hooks/useConfirm";

// price 영역 확인 필요
const ThemeDetailPage = ({ theme }) => {
  const { escapeRoom, setEscapeRoom } = useEscapeRoom();
  const [themeDetailHeaderTitleVisible, setThemeDetailHeaderTitleVisible] =
    useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const confirm = useConfirm();

  const handleThemeDetailTitleLineUpdate = async () => {
    const isConfirmed = await confirm(
      `테마 상세 페이지의 제목 부분을 정말로 수정하시겠습니까?`
    );

    if (!isConfirmed) {
      setThemeDetailHeaderTitleVisible(false);
      return;
    }

    try {
      const newThemeDetailHeaderTitle = titleRef.current.value;
      const newThemeDetailHeaderSubtitle = subtitleRef.current.value;

      const res = await Api.patch(
        "/escape-rooms/info/theme-detail-title-line",
        {
          roomId: escapeRoom.roomId,
          themeDetailHeaderTitle: newThemeDetailHeaderTitle,
          themeDetailHeaderSubtitle: newThemeDetailHeaderSubtitle
        }
      );

      setEscapeRoom(res.data.data);

      toast.success(res.data.msg);
      setThemeDetailHeaderTitleVisible(false);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    if (searchParams.get("register") === "true") {
      toast.success("작성하신 테마 정보가 추가되었습니다.");
    } else if (searchParams.get("update") === "true") {
      toast.success("테마 정보가 수정되었습니다.");
    }

    setSearchParams({});
  }, []);
  return (
    <>
      <Header
        title={escapeRoom.themeDetailHeaderTitle}
        subtitle={escapeRoom.themeDetailHeaderSubtitle}
        text="제목 수정"
        reservation={true}
        handleUpdate={() =>
          setThemeDetailHeaderTitleVisible(!themeDetailHeaderTitleVisible)
        }
      />

      {themeDetailHeaderTitleVisible && (
        <>
          <InfoEditForm
            labelVal="제목"
            currentTitle={escapeRoom.themeDetailHeaderTitle}
            onRef={titleRef}
            autoFocus={true}
          />

          <InfoEditForm
            labelVal="부제목"
            currentTitle={escapeRoom.themeDetailHeaderSubtitle}
            onRef={subtitleRef}
            viewButton={true}
            onUpdate={handleThemeDetailTitleLineUpdate}
            onCancel={() => setThemeDetailHeaderTitleVisible(false)}
          />
        </>
      )}

      <ThemeDetail theme={theme} />

      {/* 테마 가격표 영역 */}
      <OneThemePriceSection theme={theme} />
    </>
  );
};

export default ThemeDetailPage;
