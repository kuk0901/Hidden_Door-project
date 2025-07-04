import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useEscapeRoom } from "@hooks/useEscapeRoom";
import Header from "@components/common/layout/Header";
import InfoEditForm from "@components/common/form/infoEditForm";
import Api from "@axios/api";
import ThemeDetail from "@components/theme/ThemeDetail";
import { Link, useParams, useSearchParams } from "react-router-dom";
import OneThemePriceSection from "@components/price/OneThemePriceSection";
import useConfirm from "@hooks/useConfirm";
import Loading from "@components/common/loading/Loading";

const ThemeDetailPage = () => {
  const { themeId } = useParams();
  const [theme, setTheme] = useState(null);
  const { escapeRoom, setEscapeRoom } = useEscapeRoom();
  const [themeDetailHeaderTitleVisible, setThemeDetailHeaderTitleVisible] =
    useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const confirm = useConfirm();

  const getThemeInfo = async () => {
    try {
      const res = await Api.get(`/themes/theme/${themeId}`);

      if (res.status !== 200) {
        toast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }

      setTheme(res.data.data);
    } catch (error) {
      toast.error(
        error.message ??
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

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
        `/escape-rooms/info/theme-detail-title-line/${escapeRoom.roomId}`,
        {
          themeDetailHeaderTitle: newThemeDetailHeaderTitle,
          themeDetailHeaderSubtitle: newThemeDetailHeaderSubtitle
        }
      );

      if (res.status !== 200) {
        toast.error(
          "테마 상세 페이지의 제목 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

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
    getThemeInfo();

    if (searchParams.get("register") === "true") {
      toast.success("작성하신 테마 정보가 추가되었습니다.");
    } else if (searchParams.get("update") === "true") {
      toast.success("테마 정보가 수정되었습니다.");
    }

    setSearchParams({});
  }, []);

  if (!theme) {
    return <Loading />;
  }

  return (
    <>
      <Header
        title={
          escapeRoom.themeDetailHeaderTitle ||
          "방탈출 카페 정보를 추가해주세요."
        }
        subtitle={
          escapeRoom.themeDetailHeaderSubtitle ||
          "방탈출 카페 정보를 추가해주세요."
        }
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
            currentTitle={
              escapeRoom.themeDetailHeaderTitle ||
              "방탈출 카페 정보를 추가해주세요."
            }
            onRef={titleRef}
            autoFocus={true}
          />

          <InfoEditForm
            labelVal="부제목"
            currentTitle={
              escapeRoom.themeDetailHeaderSubtitle ||
              "방탈출 카페 정보를 추가해주세요."
            }
            onRef={subtitleRef}
            viewButton={true}
            onUpdate={handleThemeDetailTitleLineUpdate}
            onCancel={() => setThemeDetailHeaderTitleVisible(false)}
          />
        </>
      )}

      {theme && <ThemeDetail theme={theme} setTheme={setTheme} />}

      {/* 테마 가격표 영역 */}
      <OneThemePriceSection theme={theme} />

      <div className="link-container link-container__theme">
        <Link to="/hidden_door/theme" className="btn btn__theme">
          돌아가기
        </Link>
      </div>
    </>
  );
};

export default ThemeDetailPage;
