import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { formatPhoneNumber, formatNumberToPrice } from "@utils/format/number";

const ReservationSummaryPage = () => {
  const { reservationNumber } = useParams();
  const location = useLocation();
  const [reservationDto, setReservationDto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!reservationNumber) {
      toast.error("예약 번호가 없습니다.");
    }
  }, [location.state, reservationNumber]);

  useEffect(() => {
    const fetchReservationSummary = async () => {
      try {
        const res = await Api.get(`/reservations/summary/${reservationNumber}`);

        if (res.status !== 200) {
          toast.error(
            "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
          );
          return;
        }

        setReservationDto(res.data.data);
      } catch (error) {
        toast.error(
          "예약 조회 실패: " + (error.response?.data?.message || error.message)
        );
      }
    };

    if (reservationNumber) {
      fetchReservationSummary();
    }
  }, [reservationNumber]);

  if (!reservationDto) {
    return <p>예약 정보를 불러오는 중...</p>;
  }

  return (
    <section className="reservation-summary-container">
      <div>
        <div className="reservation-summary">
          <h1>예약 상세 정보</h1>
          <p>예약 번호: {reservationDto.reservationNumber}</p>
          <p>이름: {reservationDto.name}</p>
          <p>이메일: {reservationDto.email}</p>
          <p>전화번호: {formatPhoneNumber(reservationDto.phone)}</p>
          <p>예약 날짜: {reservationDto.kstResDate}</p>
          <p>예약 시간: {reservationDto.kstResTime}</p>
          <p>인원 수: {reservationDto.partySize}명</p>
          <p>
            총 결제 금액: {formatNumberToPrice(reservationDto.paymentAmount)}원
          </p>
          <p>결제 방법: {reservationDto.paymentMethod}</p>
        </div>

        <div className="button-container">
          <button
            className="back-button"
            onClick={() => navigate("/hidden_door/main")}
          >
            돌아가기
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReservationSummaryPage;
