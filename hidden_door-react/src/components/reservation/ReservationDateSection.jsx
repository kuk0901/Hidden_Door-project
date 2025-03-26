import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ReservationDateSection = ({
  selectedDate,
  setSelectedDate,
  availableDates,
}) => {
  return (
    <div className="date-section">
      <h2 className="section-title">날짜 선택</h2>
      <Calendar
        className="date-calendar"
        onChange={setSelectedDate}
        value={selectedDate}
        minDate={new Date()}
        tileDisabled={({ date }) =>
          !availableDates.includes(date.toISOString().split('T')[0])
        }
      />
    </div>
  );
};

export default ReservationDateSection;
