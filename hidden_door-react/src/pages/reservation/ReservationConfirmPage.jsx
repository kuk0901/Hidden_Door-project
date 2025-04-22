import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { formatKoreanDate } from "@utils/format/date";

const ReservationConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedTime, selectedTheme, themes } = location.state;

  const [reservation, setReservation] = useState({
    name: "",
    email: "",
    phone: "",
    partySize: 1,
    availability: "N",
    paymentState: "N",
    paymentMethod: "현장",
    refundState: "N",
    themeId: selectedTheme,
    reservationDate: selectedDate.toISOString(),
    reservationTime: selectedTime,
    paymentAmount: 0,
  });

  console.log("reservation: ", reservation);

  const [selectedThemeDetails, setSelectedThemeDetails] = useState(null);

  useEffect(() => {
    const theme = themes.find((t) => t.themeId === selectedTheme);
    setSelectedThemeDetails(theme);
    if (theme) {
      setReservation((prev) => ({
        ...prev,
        partySize: theme.minParticipants,
        paymentAmount: theme.price * theme.minParticipants,
      }));
    }
  }, [selectedTheme, themes]);

  useEffect(() => {
    if (selectedThemeDetails) {
      setReservation((prev) => ({
        ...prev,
        paymentAmount: selectedThemeDetails.price * prev.partySize,
      }));
    }
  }, [reservation.partySize, selectedThemeDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({
      ...prev,
      [name]: name === "partySize" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!reservation.name || !reservation.email || !reservation.phone) {
        toast.error("이름, 이메일, 전화번호는 필수 입력 항목입니다");
        return;
      }
      const reservationDto = {
        themeId: reservation.themeId,
        name: reservation.name,
        phone: reservation.phone,
        email: reservation.email,
        reservationDate: reservation.reservationDate,
        reservationTime: reservation.reservationTime,
        partySize: reservation.partySize,
        paymentAmount: reservation.paymentAmount,
        availability: reservation.availability,
        paymentState: reservation.paymentState,
        paymentMethod: reservation.paymentMethod,
        refundState: reservation.refundState,
      };

      console.log("요청 데이터:", reservationDto);

      const res = await Api.post("/reservations/create", reservationDto);

      // XXX: status 사용으로 에러 처리 변경해 주세요.
      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      // XXX: navigate 사용하실 거면 CustomerPage, CustomerAddPage 컴포넌트 참고해 수정해 주세요.
      navigate(
        `/hidden_door/reservation/summary/${res.data.data.reservationNumber}`
      );

      const reservationNumber = res.data.data.reservationNumber;
      if (!reservationNumber) {
        toast.error("예약 번호를 받지 못했습니다.");
        return;
      }
    } catch (error) {
      toast.error(error.message || "예약 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="reservation-confirm-page">
      <h1>예약 확인</h1>

      <form onSubmit={handleSubmit}>
        <div className="reservation-details">
          <div className="form-group">
            <label htmlFor="reservationDate">날짜</label>
            <div id="reservationDate">
              {formatKoreanDate(reservation.reservationDate)}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reservationTime">시간</label>
            <div id="reservationTime">{reservation.reservationTime}</div>
          </div>

          <div className="form-group">
            <label htmlFor="themeName">테마명</label>
            <div id="themeName">{selectedThemeDetails?.themeName}</div>
          </div>

          <div className="form-group">
            <label htmlFor="name">성함</label>
            <input
              type="text"
              id="name"
              name="name"
              value={reservation.name}
              onChange={handleInputChange}
              placeholder="성함을 입력해주세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={reservation.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력해주세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">휴대폰</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={reservation.phone}
              onChange={handleInputChange}
              placeholder="휴대폰 번호를 입력해주세요"
              required
            />
          </div>

          {selectedThemeDetails && (
            <div className="form-group">
              <label htmlFor="partySize">인원 수</label>
              <select
                id="partySize"
                name="partySize"
                value={reservation.partySize}
                onChange={handleInputChange}
              >
                {Array.from(
                  {
                    length:
                      selectedThemeDetails.maxParticipants -
                      selectedThemeDetails.minParticipants +
                      1,
                  },
                  (_, i) => i + selectedThemeDetails.minParticipants
                ).map((num) => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <p>총 가격 : {reservation.paymentAmount.toLocaleString()}원</p>
          </div>

          <button type="submit" className="submit-button">
            예약 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationConfirmPage;
