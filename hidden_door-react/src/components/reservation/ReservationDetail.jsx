import { useEffect, useState } from "react";
import { formatPhoneNumber, formatNumberToPrice } from "@utils/format/number";
import ReservationDetailSkeleton from "@components/common/loading/skeletonUI/ReservationDetailSkeleton";

const ReservationDetail = ({ reservationDetail, onPaymentStateChange }) => {
  const [paymentState, setPaymentState] = useState(
    reservationDetail?.paymentState || "N"
  );

  useEffect(() => {
    setPaymentState(reservationDetail?.paymentState || "N");
  }, [reservationDetail]);

  const handlePaymentChange = (e) => {
    const newState = e.target.value;
    setPaymentState(newState);
    onPaymentStateChange(newState);
  };

  if (!reservationDetail) {
    return <ReservationDetailSkeleton />;
  }

  return (
    <div className="reservation-detail">
      <h1>예약 상세 정보</h1>
      <p>
        <span className="semibold">테마명:</span> {reservationDetail.themeName}
      </p>
      <p>
        <span className="semibold">성함:</span> {reservationDetail.name}
      </p>
      <p>
        <span className="semibold">연락처:</span>{" "}
        {formatPhoneNumber(reservationDetail.phone)}
      </p>
      <p>
        <span className="semibold">이메일: </span> {reservationDetail.email}
      </p>
      <p>
        <span className="semibold">예약 날짜: </span>{" "}
        {reservationDetail.kstResDate}
      </p>
      <p>
        <span className="semibold">예약 시간: </span>{" "}
        {reservationDetail.kstResTime}
      </p>
      <p>
        <span className="semibold">예약 번호: </span>{" "}
        {reservationDetail.reservationNumber}
      </p>
      <p>
        <span className="semibold">인원 수:</span> {reservationDetail.partySize}
        명
      </p>
      <p>
        <span className="semibold">총 결제 금액: </span>
        {formatNumberToPrice(reservationDetail.paymentAmount)}원
      </p>
      <p>
        <span className="semibold">결제 방법:</span>{" "}
        {reservationDetail.paymentMethod}
      </p>
      <fieldset className="paymentState">
        <legend className="semibold">결제 여부:</legend>
        <label style={{ marginRight: "20px" }}>
          <input
            type="radio"
            name="paymentState"
            value="N"
            checked={paymentState === "N"}
            onChange={handlePaymentChange}
          />
          미결제
        </label>
        <label>
          <input
            type="radio"
            name="paymentState"
            value="Y"
            checked={paymentState === "Y"}
            onChange={handlePaymentChange}
          />
          결제 완료
        </label>
      </fieldset>
      <p>
        <span className="semibold">결제 날짜: </span>
        {reservationDetail.kstPayDate === "" ||
        reservationDetail.kstPayDate === "1970-01-01"
          ? "아직 결제가 되지 않았습니다"
          : reservationDetail.kstPayDate}
      </p>
    </div>
  );
};

export default ReservationDetail;
