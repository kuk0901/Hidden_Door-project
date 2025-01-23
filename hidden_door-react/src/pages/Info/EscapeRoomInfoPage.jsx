import { toast } from "react-toastify";
import Api from "@axios/api";
import { useState, useEffect, useRef } from "react";

import Header from "@components/common/layout/Header";
import DefaultSection from "@components/common/sections/DefaultSection";
import Loading from "@components/common/loading/Loading";
import InfoEditForm from "@components/common/form/InfoEditForm";
import LockAnimation from "@components/animation/LockAnimation";
import Button from "@components/common/buttons/Button";
// import PriceTable from "@components/common/table/PriceTable"; // 이미지 예시 코드
import CautionList from "@components/caution/CautionList";

// import { useImgUrl } from "@hooks/useImgUrl"; // 이미지 예시 코드

const EscapeRoomInfoPage = () => {
  const [escapeRoomInfo, setEscapeRoomInfo] = useState([]);

  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef(null);

  const [explanationVisible, setExplanationVisible] = useState(false);
  const explanationRef = useRef(null);

  // const imageUrl = useImgUrl(escapeRoomInfo?.storedFileName); // 이미지 예시 코드

  const getEscapeRoomInfo = async () => {
    try {
      const res = await Api.get("/api/v1/escape-rooms/info");

      setEscapeRoomInfo(res.data.data);
    } catch (error) {
      toast.error(error.message || "알 수 없는 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    getEscapeRoomInfo();
  }, []);

  const handleTitleUpdate = async () => {
    try {
      const newTitle = titleRef.current.value;

      const res = await Api.put("/api/v1/escape-rooms/info", {
        ...escapeRoomInfo,
        title: newTitle
      });

      setEscapeRoomInfo(res.data.data);

      toast.success("제목이 성공적으로 수정되었습니다.");
    } catch (error) {
      toast.error(error.message || "알 수 없는 오류가 발생했습니다.");
    }
  };

  const handleExplanationUpdate = async () => {
    try {
      const newExplanation = explanationRef.current.value;

      const res = await Api.put("/api/v1/escape-rooms/info", {
        ...escapeRoomInfo,
        explanation: newExplanation
      });

      setEscapeRoomInfo(res.data.data);

      toast.success("상세 설명이 성공적으로 수정되었습니다.");
    } catch (error) {
      toast.error(error.message || "알 수 없는 오류가 발생했습니다.");
    }
  };

  if (!escapeRoomInfo) return <Loading />;

  // FIXME: 각 영역 코드 작성
  return (
    <>
      <Header
        title={escapeRoomInfo.title}
        text="제목 수정"
        reservation={true}
        handleUpdate={() => setTitleVisible(!titleVisible)}
      />

      {titleVisible && (
        <InfoEditForm
          labelVal="제목"
          currentTitle={escapeRoomInfo.title}
          onUpdate={handleTitleUpdate}
          onCancel={() => setTitleVisible(false)}
          onRef={titleRef}
        />
      )}

      <section className="section section-description">
        {/* animation */}
        <LockAnimation />

        {/* explanation */}
        <div className="info-explanation text-center">
          {escapeRoomInfo.explanation}
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
            currentTitle={escapeRoomInfo.explanation}
            onUpdate={handleExplanationUpdate}
            onCancel={() => setExplanationVisible(false)}
            onRef={explanationRef}
            area={true}
          />
        )}
      </section>

      {/* 이미지 예시 코드
      
      <section>
        <img
          src={imageUrl}
          alt={escapeRoomInfo.storedFileName}
          style={{ width: "500px", height: "500px" }}
        />
      </section> */}

      {/* price */}
      {/* <DefaultSection
        api=""
        className="section section-price"
        title="price"
        ChildComponent={PriceTable}
      /> */}

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
