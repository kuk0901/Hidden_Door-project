import { useState, useEffect } from "react";
import Api from "@axios/api";
import ReservationDateSection from "@components/reservation/ReservationDateSection";
import ReservationTimeSection from "@components/reservation/ReservationTimeSection";
import ReservationThemeSection from "@components/reservation/ReservationThemeSection";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { formatReservationSelectedDate } from "@utils/format/date";

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
      const formattedDate = formatReservationSelectedDate(selectedDate);

      console.log("selectedDate1: ", selectedDate);

      console.log("selectedDate2: ", selectedDate.toISOString());

      console.log(formattedDate);

      // 1. API 경로 수정 (서버와 일치시킴)
      const res = await Api.get("/reservations/timeslots", {
        params: { date: formattedDate, themeId: selectedTheme },
        validateStatus: (status) => status === 200, // 404는 catch로 넘김
      });

      // 2. 응답 데이터 검증
      if (!res.data?.data?.timeSlots) {
        throw new Error("시간대 데이터가 없습니다.");
      }
      setAvailableTimeSlots(res.data.data.timeSlots);
    } catch (error) {
      console.error("API Error:", {
        url: error.config?.url, // 요청 URL 확인
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(error.response?.data?.message || "시간대 조회 실패");
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
