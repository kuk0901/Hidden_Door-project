import { useEffect, useState } from "react";
import { formatPhoneNumber, formatNumberToPrice } from "@utils/format/number";

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
    return <div>Loading...</div>;
  }
  //FIXME : 확인해야함
  return (
    <div className="reservation-detail">
      <h1>예약 상세 정보</h1>
      <p>테마명: {reservationDetail.themeName}</p>
      <p>성함: {reservationDetail.name}</p>
      <p>연락처: {formatPhoneNumber(reservationDetail.phone)}</p>
      <p>이메일: {reservationDetail.email}</p>
      <p>예약 날짜: {reservationDetail.kstResDate}</p>
      <p>예약 시간: {reservationDetail.kstResTime}</p>
      <p>예약 번호: {reservationDetail.reservationNumber}</p>
      <p>인원 수: {reservationDetail.partySize}명</p>
      <p>
        총 결제 금액: {formatNumberToPrice(reservationDetail.paymentAmount)}원
      </p>
      <p>결제 방법: {reservationDetail.paymentMethod}</p>
      <p>
        결제 여부:{" "}
        <label>
          <input
            type="radio"
            name="paymentState"
            value="N"
            checked={paymentState === "N"}
            onChange={handlePaymentChange}
          />
          미결제
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="paymentState"
            value="Y"
            checked={paymentState === "Y"}
            onChange={handlePaymentChange}
          />
          결제 완료
        </label>
      </p>
      <p>
        결제 날짜:{" "}
        {reservationDetail.kstPayDate === "" ||
        reservationDetail.kstPayDate === "1970-01-01"
          ? "아직 결제가 되지 않았습니다"
          : reservationDetail.kstPayDate}
      </p>
    </div>
  );
};

export default ReservationDetail;
