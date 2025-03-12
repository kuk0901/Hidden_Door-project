import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "@axios/api";

const ReservationConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDate, selectedTime, selectedTheme, themes } = location.state;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [selectedThemeDetails, setSelectedThemeDetails] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (themes && themes.length > 0) {
      const theme = themes.find((t) => t.themeId === selectedTheme);
      if (theme) {
        setSelectedThemeDetails(theme);
        setPartySize(theme.minParticipants);
        setTotalPrice(theme.price * theme.minParticipants);
      } else {
        alert("선택한 테마를 찾을 수 없습니다.");
      }
    } else {
      console.error("테마 목록이 비어 있습니다.");
      alert("테마 목록이 비어 있습니다.");
    }
  }, [selectedTheme, themes]);

  useEffect(() => {
    if (selectedThemeDetails) {
      setTotalPrice(selectedThemeDetails.price * partySize);
    }
  }, [partySize, selectedThemeDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post("/reservations/create", {
        name,
        phone,
        partySize,
        reservationDate: selectedDate,
        reservationTime: selectedTime,
        themeId: selectedTheme,
        totalPrice,
      });
      if (response.data.success) {
        alert("예약이 완료되었습니다.");
        navigate("/");
      }
    } catch (error) {
      console.error("예약 중 오류 발생:", error);
      alert("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="reservation-confirm-page">
      <h1>예약 확인</h1>
      <div className="reservation-details">
        <p>
          날짜:{" "}
          {selectedDate instanceof Date
            ? selectedDate.toLocaleDateString()
            : selectedDate}
        </p>
        <p>시간: {selectedTime}</p>
        <p>테마: {selectedThemeDetails?.themeName || "테마 이름 없음"}</p>
      </div>
      <form onSubmit={handleSubmit}>
        {/* 성함 입력 */}
        <div className="form-group">
          <label htmlFor="name">성함:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="성함을 입력해주세요"
            required
          />
        </div>

        {/* 휴대폰 입력 */}
        <div className="form-group">
          <label htmlFor="phone">휴대폰:</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="휴대폰 번호를 기입해주세요"
            required
          />
        </div>

        {/* 인원 수 선택 */}
        {selectedThemeDetails && (
          <div className="form-group">
            <label htmlFor="partySize">인원 수:</label>
            <select
              id="partySize"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
            >
              {[
                ...Array(
                  selectedThemeDetails.maxParticipants -
                    selectedThemeDetails.minParticipants +
                    1
                ).keys(),
              ].map((num) => (
                <option
                  key={num + selectedThemeDetails.minParticipants}
                  value={num + selectedThemeDetails.minParticipants}
                >
                  {num + selectedThemeDetails.minParticipants}명
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <p>총 가격: {totalPrice}원</p>
        </div>

        <button type="submit">예약하기</button>
      </form>
    </div>
  );
};

export default ReservationConfirmPage;
