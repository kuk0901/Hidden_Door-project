import { useState, useEffect } from "react";
import Api from "@axios/api";
import ReservationDateSection from "@components/reservation/ReservationDateSection";
import ReservationTimeSection from "@components/reservation/ReservationTimeSection";
import ReservationThemeSection from "@components/reservation/ReservationThemeSection";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const ReservationMainPage = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState({
    availableDates: [],
    themes: [], // timeSlots 제거
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkReservationNumber, setCheckReservationNumber] = useState("");
  const [checkName, setCheckName] = useState("");

  // 선택된 날짜/테마 변경 시 시간대 재조회
  useEffect(() => {
    if (selectedTheme && selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedTheme, selectedDate]);

  const fetchAvailableTimeSlots = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];

      // XXX: validateStatus: (status) => status < 500, // 500 에러 명시적 처리 코드는 변경해 주세요.
      // 현재 코드는 500번대 미만의 에러를 모두 성공으로 처리합니다. -> 400번대도 정상 응답처리
      const res = await Api.get("/reservations/timeslots", {
        params: {
          date: formattedDate,
          themeId: selectedTheme,
        },
        validateStatus: (status) => status < 500, // 500 에러 명시적 처리
      });
      setAvailableTimeSlots(res.data?.data?.timeSlots || []);
    } catch (error) {
      console.error("Error Details:", {
        config: error.config,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error("시간대 조회에 실패했습니다. 서버 로그를 확인해주세요.");
    }
  };

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const res = await Api.get("/reservations/main");

      // XXX: 조건문으로 status 확인해 주세요.

      setPageData({
        availableDates: res.data.data.availableDates,
        themes: res.data.data.themes,
      });
    } catch (error) {
      // XXX: 더 명확한 메시지 내용으로 수정해 주세요.
      // error.message가 있는 경우와 없는 경우
      toast.error("데이터를 불러오는데 실패했습니다.");
      console.error("Error fetching page data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckReservation = async () => {
    try {
      const response = await Api.get("/reservations/check", {
        params: {
          reservationNumber: checkReservationNumber,
          name: checkName,
        },
      });

      // XXX: status 비교로 변경해 주세요.

      if (response.data) {
        navigate(`/hidden_door/reservation/summary/${checkReservationNumber}`);
      } else {
        toast.error("예약을 찾을 수 없습니다.");
      }
    } catch (error) {
      toast.error("예약 확인 중 오류가 발생했습니다.", error);
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
            isDateAndThemeSelected={selectedDate && selectedTheme} // 추가
          />
        </div>

        <button
          className="submit-button"
          type="button"
          disabled={!selectedDate || !selectedTime || !selectedTheme}
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

        <button
          type="button"
          className="check-button"
          onClick={() => setIsModalOpen(true)}
        >
          예약 확인
        </button>

        {/* 예약 확인 모달 */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="예약 확인"
          className="reservation-check-modal"
          overlayClassName="reservation-check-overlay"
        >
          <h2>예약 확인</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
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
            <div className="input-group">
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
            <div className="button-group">
              <button
                type="button"
                onClick={handleCheckReservation}
                disabled={!checkReservationNumber || !checkName}
              >
                확인
              </button>
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
