import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";

const ReservationConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedTime, selectedTheme, themes } = location.state;

  // CustomerAddPage 스타일 상태 관리
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

  // 테마 정보 로드
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

  // 실시간 가격 계산
  useEffect(() => {
    if (selectedThemeDetails) {
      setReservation((prev) => ({
        ...prev,
        paymentAmount: selectedThemeDetails.price * prev.partySize,
      }));
    }
  }, [reservation.partySize, selectedThemeDetails]);

  // CustomerAddPage 방식의 입력 처리
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
      // ReservationDto 구조에 맞게 데이터 변환
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

      console.log(reservationDto);

      const res = await Api.post("/reservations/create", reservationDto);

      if (res.data.success) {
        toast.success(res.data.msg);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "예약 처리 실패");
    }
  };

  return (
    <div className="reservation-confirm-page">
      <h1>예약 확인</h1>
      <div className="reservation-details">
        <p>
          날짜: {new Date(reservation.reservationDate).toLocaleDateString()}
        </p>
        <p>시간: {reservation.reservationTime}</p>
        <p>테마: {selectedThemeDetails?.themeName}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 입력 필드들 - CustomerAddPage 스타일 */}
        <div className="form-group">
          <label>성함:</label>
          <input
            type="text"
            name="name"
            value={reservation.name}
            onChange={handleInputChange}
            placeholder="성함을 입력해주세요"
            required
          />
        </div>

        <div className="form-group">
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={reservation.email}
            onChange={handleInputChange}
            placeholder="이메일을 입력해주세요"
            required
          />
        </div>

        <div className="form-group">
          <label>휴대폰:</label>
          <input
            type="tel"
            name="phone"
            value={reservation.phone}
            onChange={handleInputChange}
            placeholder="휴대폰 번호를 입력해주세요"
            required
          />
        </div>

        {/* 인원 수 선택 */}
        {selectedThemeDetails && (
          <div className="form-group">
            <label>인원 수:</label>
            <select
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
          <p>총 가격: {reservation.paymentAmount.toLocaleString()}원</p>
        </div>

        {/* 숨겨진 필드들 */}
        <input
          type="hidden"
          name="availability"
          value={reservation.availability}
        />
        <input
          type="hidden"
          name="paymentState"
          value={reservation.paymentState}
        />
        <input
          type="hidden"
          name="paymentMethod"
          value={reservation.paymentMethod}
        />
        <input
          type="hidden"
          name="refundState"
          value={reservation.refundState}
        />

        <button type="submit">예약 완료</button>
      </form>
    </div>
  );
};

export default ReservationConfirmPage;
