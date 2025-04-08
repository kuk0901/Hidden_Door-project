const ReservationTimeSection = ({
  selectedTime,
  setSelectedTime,
  timeSlots,
}) => {
  return (
    <div className="time-section">
      <h2 className="section-title">시간 선택</h2>
      <div className="time-slots">
        {timeSlots && timeSlots.length > 0 ? (
          timeSlots.map((slot) => (
            <button
              key={slot.time}
              type="button" // type="button" 추가하여 폼 제출 방지
              onClick={() => setSelectedTime(slot.time)}
              className={`time-slot ${
                selectedTime === slot.time ? "selected" : ""
              } ${!slot.isAvailable ? "unavailable" : ""}`}
              disabled={!slot.isAvailable}
            >
              {slot.time}
            </button>
          ))
        ) : (
          <p>날짜와 테마를 선택해 주세요.</p>
        )}
      </div>
    </div>
  );
};

export default ReservationTimeSection;
