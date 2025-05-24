import { toast } from "react-toastify";
import Api from "@axios/api";
import { useState, useRef, useEffect } from "react";
import { debounce } from "lodash";
import Header from "@components/common/layout/Header";

import InfoEditForm from "@components/common/form/InfoEditForm";
import LockAnimation from "@components/animation/LockAnimation";
import Button from "@components/common/buttons/Button";
import { useEscapeRoom } from "@hooks/useEscapeRoom";
import PriceSection from "@components/price/PriceSection";
import useConfirm from "@hooks/useConfirm";
import MiniPriceSection from "@components/price/MiniPriceSection";
import { useAdmin } from "@hooks/useAdmin";
import CautionSection from "../../components/caution/CautionSection";
import { isTextUnchanged } from "@utils/comparison/stringComparator";

const EscapeRoomInfoPage = () => {
  const { escapeRoom, setEscapeRoom } = useEscapeRoom();

  const { isAdmin } = useAdmin();

  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef(null);

  const [explanationVisible, setExplanationVisible] = useState(false);
  const explanationRef = useRef(null);
  const confirm = useConfirm();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleTitleUpdate = async () => {
    const isConfirmed = await confirm(
      `상세 페이지 제목을 정말로 수정하시겠습니까?`
    );

    if (!isConfirmed) {
      setTitleVisible(false);
      return;
    }

    try {
      const newTitle = titleRef.current.value;
      const isUnchanged = isTextUnchanged(escapeRoom.title, newTitle);

      if (isUnchanged) {
        toast.warn("변경된 내용이 없습니다.");
        return;
      }

      const res = await Api.patch(
        `/escape-rooms/info/title/${escapeRoom.roomId}`,
        {
          title: newTitle
        }
      );

      console.log(res);

      if (res.status !== 200) {
        setEscapeRoom(escapeRoom);
        toast.error(
          "방탈출 카페 제목 변경에 실패했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setEscapeRoom(res.data.data);

      toast.success("제목이 성공적으로 수정되었습니다.");
      setTitleVisible(false);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  const handleExplanationUpdate = async () => {
    const isConfirmed = await confirm(
      `상세 페이지 설명을 정말로 수정하시겠습니까?`
    );

    if (!isConfirmed) {
      setExplanationVisible(false);
      return;
    }

    try {
      const newExplanation = explanationRef.current.value;

      const res = await Api.patch(
        `/escape-rooms/info/explanation/${escapeRoom.roomId}`,
        {
          explanation: newExplanation
        }
      );

      if (res.status !== 200) {
        toast.error(
          "상세 설명 수정에 실패했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setEscapeRoom(res.data.data);

      toast.success("상세 설명이 성공적으로 수정되었습니다.");
      setExplanationVisible(false);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200);

    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel(); // debounce 취소
    };
  }, []);

  return (
    <>
      <Header
        title={escapeRoom.title || "방탈출 카페 정보를 추가해주세요."}
        text="제목 수정"
        reservation={true}
        handleUpdate={() => setTitleVisible(!titleVisible)}
      />

      {titleVisible && (
        <InfoEditForm
          labelVal="제목"
          currentTitle={escapeRoom.title || "방탈출 카페 정보를 추가해주세요."}
          onUpdate={handleTitleUpdate}
          onCancel={() => setTitleVisible(false)}
          onRef={titleRef}
          viewButton={true}
          autoFocus={true}
          id="title"
          name="title"
        />
      )}

      <section className="section section--description">
        {/* animation */}
        <LockAnimation />

        {/* explanation */}
        <div className="info-explanation text-center">
          {escapeRoom.explanation || "방탈출 카페 정보를 추가해주세요."}
        </div>

        {isAdmin && (
          <div className="btn-container">
            <Button
              className="btn"
              text="수정"
              onClick={() => setExplanationVisible(!explanationVisible)}
            />
          </div>
        )}

        {explanationVisible && (
          <InfoEditForm
            labelVal="상세 설명"
            currentTitle={
              escapeRoom.explanation || "방탈출 카페 정보를 추가해주세요."
            }
            onUpdate={handleExplanationUpdate}
            onCancel={() => setExplanationVisible(false)}
            onRef={explanationRef}
            area={true}
            viewButton={true}
            autoFocus={true}
            id="explanation"
            name="explanation"
          />
        )}
      </section>

      {windowWidth > 768 ? <PriceSection /> : <MiniPriceSection />}

      {/* caution */}
      <CautionSection />
    </>
  );
};

export default EscapeRoomInfoPage;
