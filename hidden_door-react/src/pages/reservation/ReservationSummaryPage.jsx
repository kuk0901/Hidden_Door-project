import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ReservationSummaryPage = () => {
  const { reservationNumber } = useParams();
  const location = useLocation();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    if (!reservationNumber) {
      toast.error("예약 번호가 없습니다.");
    }
  }, [location.state, reservationNumber]);

  useEffect(() => {
    const fetchReservationSummary = async () => {
      try {
        const res = await Api.get(`/reservations/summary/${reservationNumber}`);

        // XXX: response.status !== 200 조건으로 사용해 toast로 에러 메시지 띄우는 형태로 수정해 주세요.
        if (res.data.data) {
          setReservation(res.data.data);
        } else {
          toast.error("예약 정보 구조가 올바르지 않습니다.");
        }
      } catch (error) {
        console.error("API 호출 에러:", error);
        if (error.response) {
          console.error("에러 응답:", error.response.data);
          console.error("에러 상태:", error.response.status);
        }
        toast.error(
          "예약 조회 실패: " + (error.response?.data?.message || error.message)
        );
      }
    };

    if (reservationNumber) {
      fetchReservationSummary();
    }
  }, [reservationNumber]);

  if (!reservation) {
    return <p>예약 정보를 불러오는 중...</p>;
  }

  return (
    <div className="reservation-summary-container">
      <div className="reservation-summary">
        <h1>예약 상세 정보</h1>
        <p>예약 번호: {reservation.reservationNumber}</p>
        <p>이름: {reservation.name}</p>
        <p>이메일: {reservation.email}</p>
        <p>전화번호: {reservation.phone}</p>
        <p>예약 날짜: {reservation.kstResDate}</p>
        <p>예약 시간: {reservation.reservationTime || "정보 없음"}</p>
        <p>인원 수: {reservation.partySize}명</p>
        <p>총 결제 금액: {reservation.paymentAmount}원</p>
        <p>예약 생성일: {reservation.kstResCreDate}</p>
        <p>결제 방법: {reservation.paymentMethod}</p>
      </div>
    </div>
  );
};

export default ReservationSummaryPage;
