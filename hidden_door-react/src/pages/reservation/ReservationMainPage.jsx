import { useState, useEffect, useCallback } from "react";
import Api from "@axios/api";
import ReservationDateSection from "@components/reservation/ReservationDateSection";
import ReservationTimeSection from "@components/reservation/ReservationTimeSection";
import ReservationThemeSection from "@components/reservation/ReservationThemeSection";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { formatReservationSelectedDate } from "@utils/format/date";
import ReservationCheckModal from "@components/reservation/ReservationCheckModal";
import ReservationMainPageSkeleton from "@components/common/loading/skeletonUI/ReservationMainPageSkeleton";

Modal.setAppElement("#root");

const ReservationMainPage = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState({
    availableDates: [],
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedTheme && selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedTheme, selectedDate]);

  const fetchAvailableTimeSlots = async () => {
    try {
      const formattedDate = formatReservationSelectedDate(selectedDate);

      const res = await Api.get("/reservations/timeslots", {
        params: { date: formattedDate, themeId: selectedTheme },
      });

      if (!res.data?.data?.timeSlots) {
        throw new Error("시간대 데이터가 없습니다.");
      }
      setAvailableTimeSlots(res.data.data.timeSlots);
    } catch (error) {
      console.error("API Error:", {
        url: error.config?.url,
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

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setPageData({
        availableDates: res.data.data.availableDates,
        themes: res.data.data.themes,
      });
    } catch (error) {
      toast.error(error.message || "예약 페이지를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservation = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      navigate("/hidden_door/reservation/confirm", {
        state: {
          selectedDate,
          selectedTime,
          selectedTheme,
          themes: pageData.themes,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckReservation = async () => {
    try {
      const res = await Api.get("/reservations/check", {
        params: {
          reservationNumber: checkReservationNumber.trim(),
          name: checkName.trim(),
        },
      });

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      if (res.data?.data === true) {
        navigate(`/hidden_door/reservation/summary/${checkReservationNumber}`);
      } else if (res.data?.data?.exists) {
        navigate(`/hidden_door/reservation/summary/${checkReservationNumber}`);
      } else {
        toast.error("예약을 찾을 수 없습니다.");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("예약을 찾을 수 없습니다.");
      } else {
        toast.error("예약 확인 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  if (isLoading) return <ReservationMainPageSkeleton />;

  return (
    <section className="reservation-page">
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
            isDateAndThemeSelected={selectedDate && selectedTheme}
          />
        </div>

        <button
          className="submit-button"
          type="button"
          disabled={
            !selectedDate || !selectedTime || !selectedTheme || isSubmitting
          }
          onClick={handleReservation}
        >
          {isSubmitting ? "예약 진행 중..." : "예약하기"}
        </button>

        <button
          type="button"
          className="check-button"
          onClick={() => setIsModalOpen(true)}
        >
          예약 확인
        </button>
      </form>

      <ReservationCheckModal
        isOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        checkReservationNumber={checkReservationNumber}
        setCheckReservationNumber={setCheckReservationNumber}
        checkName={checkName}
        setCheckName={setCheckName}
        onCheck={handleCheckReservation}
      />
    </section>
  );
};

export default ReservationMainPage;
