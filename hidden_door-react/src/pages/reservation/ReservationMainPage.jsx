import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar"; // 달력 컴포넌트를 위해 필요합니다
import "react-calendar/dist/Calendar.css"; // 달력 스타일

const ReservationPage = () => {
  const [pageData, setPageData] = useState({
    availableDates: [],
    timeSlots: [],
    themes: []
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get("/api/v1/reservations/main");
        setPageData(response.data.data);
      } catch (error) {
        console.error("Error fetching reservation data:", error);
      }
    };

    fetchPageData();
  }, []);

  const handleDateChange = (date) => setSelectedDate(date);
  const handleTimeChange = (time) => setSelectedTime(time);
  const handleThemeChange = (theme) => setSelectedTheme(theme);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reservation submitted:", {
      selectedDate,
      selectedTime,
      selectedTheme
    });
  };

  return (
    <div className="reservation-page">
      <h1>예약하기</h1>
      <form onSubmit={handleSubmit}>
        <div className="date-selection">
          <h2>날짜 선택</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
            tileDisabled={({ date }) =>
              !pageData.availableDates?.includes(
                date.toISOString().split("T")[0]
              )
            }
          />
        </div>
        <div className="time-selection">
          <h2>시간 선택</h2>
          {pageData.timeSlots?.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeChange(time)}
              className={selectedTime === time ? "selected" : ""}
            >
              {time}
            </button>
          ))}
        </div>
        <div className="theme-selection">
          <h2>테마 선택</h2>
          {pageData.themes?.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={selectedTheme === theme.id ? "selected" : ""}
            >
              {theme.name}
            </button>
          ))}
        </div>
        <button type="submit">예약하기</button>
      </form>
    </div>
  );
};

export default ReservationPage;
