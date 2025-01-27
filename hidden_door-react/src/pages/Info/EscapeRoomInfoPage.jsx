import { toast } from "react-toastify";
import Api from "@axios/api";
import { useState, useRef } from "react";

import Header from "@components/common/layout/Header";
import DefaultSection from "@components/common/sections/DefaultSection";
import Loading from "@components/common/loading/Loading";
import InfoEditForm from "@components/common/form/InfoEditForm";
import LockAnimation from "@components/animation/LockAnimation";
import Button from "@components/common/buttons/Button";
// import PriceTable from "@components/common/table/PriceTable"; // 기갹 테이블 추후 수정
import CautionList from "@components/caution/CautionList";
import { useEscapeRoom } from "@hooks/useEscapeRoom";

const EscapeRoomInfoPage = () => {
  const { escapeRoom, setEscapeRoom } = useEscapeRoom();

  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef(null);

  const [explanationVisible, setExplanationVisible] = useState(false);
  const explanationRef = useRef(null);

  const handleTitleUpdate = async () => {
    try {
      const newTitle = titleRef.current.value;

      const res = await Api.patch("/api/v1/escape-rooms/info/title", {
        roomId: escapeRoom.roomId,
        title: newTitle
      });

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
    try {
      const newExplanation = explanationRef.current.value;

      const res = await Api.patch("/api/v1/escape-rooms/info/explanation", {
        roomId: escapeRoom.roomId,
        explanation: newExplanation
      });

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

  if (!escapeRoom) return <Loading />;

  // FIXME: 각 영역 코드 작성
  return (
    <>
      <Header
        title={escapeRoom.title}
        text="제목 수정"
        reservation={true}
        handleUpdate={() => setTitleVisible(!titleVisible)}
      />

      {titleVisible && (
        <InfoEditForm
          labelVal="제목"
          currentTitle={escapeRoom.title}
          onUpdate={handleTitleUpdate}
          onCancel={() => setTitleVisible(false)}
          onRef={titleRef}
          viewButton={true}
          autoFocus={true}
        />
      )}

      <section className="section section-description">
        {/* animation */}
        <LockAnimation />

        {/* explanation */}
        <div className="info-explanation text-center">
          {escapeRoom.explanation}
        </div>
        <div className="btn-container">
          <Button
            className="btn"
            text="수정"
            onClick={() => setExplanationVisible(!explanationVisible)}
          />
        </div>

        {explanationVisible && (
          <InfoEditForm
            labelVal="상세 설명"
            currentTitle={escapeRoom.explanation}
            onUpdate={handleExplanationUpdate}
            onCancel={() => setExplanationVisible(false)}
            onRef={explanationRef}
            area={true}
            viewButton={true}
            autoFocus={true}
          />
        )}
      </section>

      {/* price */}
      {/* <DefaultSection
        api=""
        className="section section-price"
        title="price"
        ChildComponent={PriceTable}
      /> */}
      <div
        style={{
          border: "1px solid white",
          height: "300px",
          marginBottom: "10px",
          textAlign: "center",
          fontSize: "40px"
        }}
      >
        Price
      </div>

      {/* caution */}
      <DefaultSection
        api="/api/v1/cautions/list"
        className="section section-caution"
        title="caution"
        ChildComponent={CautionList}
      />
    </>
  );
};

export default EscapeRoomInfoPage;
