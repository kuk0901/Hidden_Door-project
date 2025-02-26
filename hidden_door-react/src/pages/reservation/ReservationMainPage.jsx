import { useState, useEffect } from "react";
import Api from "@axios/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ReservationMainPage = () => {
  const [pageData, setPageData] = useState({
    availableDates: [],
    timeSlots: [],
    themes: [],
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const response = await Api.get("/reservations/main");
      console.log("Full server response:", response);
      setPageData(response.data.data); // 여기를 수정
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleDateChange = (date) => setSelectedDate(date);
  const handleTimeChange = (time) => setSelectedTime(time);
  const handleThemeChange = (themeId) => setSelectedTheme(themeId);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reservation submitted:", {
      selectedDate,
      selectedTime,
      selectedTheme,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              !pageData?.availableDates?.includes(
                date.toISOString().split("T")[0]
              )
            }
          />
        </div>
        <div className="time-selection">
          <h2>시간 선택</h2>
          {pageData &&
            pageData.timeSlots &&
            pageData.timeSlots.map((time) => (
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
          {pageData &&
            pageData.themes &&
            pageData.themes.map((theme) => (
              <button
                key={theme.themeId}
                onClick={() => handleThemeChange(theme.themeId)}
                className={selectedTheme === theme.themeId ? "selected" : ""}
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

export default ReservationMainPage;
