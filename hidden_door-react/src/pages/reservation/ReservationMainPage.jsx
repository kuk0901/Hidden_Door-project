import { useState, useEffect } from "react";
import Api from "@axios/api";
import ReservationDateSection from "../../components/reservation/ReservationDateSection";
import ReservationTimeSection from "../../components/reservation/ReservationTimeSection";
import ReservationThemeSection from "../../components/reservation/ReservationThemeSection";
import { useNavigate } from "react-router-dom";

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

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const res = await Api.get("/reservations/main");
      console.log("Full server response:", res);
      console.log(res.data.data);
      setPageData(res.data.data);

      // 초기 시간 슬롯 가용성 설정
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

  const updateTimeSlotAvailability = async () => {
    if (selectedDate && selectedTheme) {
      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        console.log("Fetching availability for:", formattedDate, selectedTheme);
        const res = await Api.get(
          `/reservations/availability?date=${formattedDate}&themeId=${selectedTheme}`
        );
        console.log("Availability response:", res.data);
        if (res.data && Array.isArray(res.data.timeSlots)) {
          setAvailableTimeSlots(res.data.timeSlots);
        } else {
          console.warn("Unexpected data format for time slots, using default");
          setAvailableTimeSlots(
            pageData.timeSlots.map((time) => ({ time, isAvailable: true }))
          );
        }
      } catch (error) {
        console.error("Error fetching time slot availability:", error);
        setAvailableTimeSlots(
          pageData.timeSlots.map((time) => ({ time, isAvailable: true }))
        );
      }
    } else {
      console.log("Using default time slots");
      setAvailableTimeSlots(
        pageData.timeSlots.map((time) => ({ time, isAvailable: true }))
      );
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    if (pageData.timeSlots.length > 0) {
      updateTimeSlotAvailability();
    }
  }, [selectedDate, selectedTheme, pageData.timeSlots]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Themes being passed:", pageData.themes); // 로그 추가
    navigate("/hidden_door/reservation/confirm", {
      state: {
        selectedDate,
        selectedTime,
        selectedTheme,
        themes: pageData.themes,
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="reservation-page">
      <h1 className="reservation-title">예약하기</h1>
      <form className="reservation-form" onSubmit={handleSubmit}>
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
        <button className="submit-button" type="submit">
          예약하기
        </button>
      </form>
    </div>
  );
};

export default ReservationMainPage;
