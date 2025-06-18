import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { formatKoreanDate } from "@utils/format/date";

const ReservationConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const { selectedDate, selectedTime, selectedTheme, themes } = location.state;
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    reservationDate: formatLocalDate(selectedDate),
    reservationTime: selectedTime,
    paymentAmount: 0,
  });

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
    if (isSubmitting) return;
    setIsSubmitting(true);
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
        reservationDateStr: reservation.reservationDate,
        reservationTime: reservation.reservationTime,
        partySize: reservation.partySize,
        paymentAmount: reservation.paymentAmount,
        availability: reservation.availability,
        paymentState: reservation.paymentState,
        paymentMethod: reservation.paymentMethod,
        refundState: reservation.refundState,
      };

      const res = await Api.post("/reservations/create", reservationDto);

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      const reservationNumber = res.data.data.reservationNumber;

      if (!reservationNumber) {
        toast.error("예약 번호를 받지 못했습니다.");
        return;
      }

      navigate(
        `/hidden_door/reservation/summary/${res.data.data.reservationNumber}`
      );
    } catch (error) {
      toast.error(error.message || "예약 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="reservation-confirm-page">
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
              className="form-input"
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
              className="form-input"
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
              className="form-input"
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
            <label>총 가격</label>
            <div>{reservation.paymentAmount.toLocaleString()}원</div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "예약 처리 중..." : "예약 완료"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReservationConfirmPage;
