import { useState, useEffect } from "react";
import Api from "@axios/api";
import ReservationDateSection from "../../components/reservation/ReservationDateSection";
import ReservationTimeSection from "../../components/reservation/ReservationTimeSection";
import ReservationThemeSection from "../../components/reservation/ReservationThemeSection";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const ReservationMainPage = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState({
    availableDates: [],
    timeSlots: [],
    themes: [],
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkReservationNumber, setCheckReservationNumber] = useState("");
  const [checkName, setCheckName] = useState("");

  const handleCheckReservation = async () => {
    try {
      const response = await Api.get("/reservations/check", {
        params: {
          reservationNumber: checkReservationNumber,
          name: checkName,
        },
      });
      if (response.data.data) {
        // 'success' 대신 'data' 확인
        navigate(`/hidden_door/reservation/summary/${checkReservationNumber}`);
      } else {
        toast.error(response.data.message || "예약을 찾을 수 없습니다.");
      }
    } catch (error) {
      toast.error("예약 확인 중 오류가 발생했습니다.", error);
    }
  };

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const res = await Api.get("/reservations/main");
      setPageData(res.data.data);

      if (res.data.data.timeSlots) {
        setAvailableTimeSlots(
          res.data.data.timeSlots.map((time) => ({
            time,
            isAvailable: true,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="reservation-page">
      <h1 className="reservation-title">예약하기</h1>
      <form className="reservation-form" onSubmit={(e) => e.preventDefault()}>
        {/* 예약하기 섹션 */}
        <div className="form-section">
          <ReservationDateSection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            availableDates={pageData.availableDates}
          />
          <ReservationThemeSection
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            themes={pageData.themes}
          />
          <ReservationTimeSection
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            timeSlots={availableTimeSlots}
          />
        </div>

        {/* 예약하기 버튼 */}
        <button
          className="submit-button"
          type="submit"
          onClick={() =>
            navigate("/hidden_door/reservation/confirm", {
              state: {
                selectedDate,
                selectedTime,
                selectedTheme,
                themes: pageData.themes,
              },
            })
          }
        >
          예약하기
        </button>

        {/* 예약 확인 버튼 */}
        <button type="button" onClick={() => setIsModalOpen(true)}>
          예약 확인
        </button>

        {/* 모달 */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="예약 확인"
          className="reservation-check-modal"
          overlayClassName="reservation-check-overlay"
        >
          <h2>예약 확인</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="reservationNumber">예약 번호</label>
              <input
                id="reservationNumber"
                type="text"
                placeholder="예약 번호"
                value={checkReservationNumber}
                onChange={(e) => setCheckReservationNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="name">이름</label>
              <input
                id="name"
                type="text"
                placeholder="이름"
                value={checkName}
                onChange={(e) => setCheckName(e.target.value)}
                required
              />
            </div>
            <div>
              {/* 예약 확인 버튼 */}
              <button type="button" onClick={handleCheckReservation}>
                확인
              </button>

              {/* 닫기 버튼 */}
              <button type="button" onClick={() => setIsModalOpen(false)}>
                닫기
              </button>
            </div>
          </form>
        </Modal>
      </form>
    </div>
  );
};

export default ReservationMainPage;
