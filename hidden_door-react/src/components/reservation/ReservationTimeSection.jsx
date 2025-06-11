const ReservationTimeSection = ({
  selectedTime,
  setSelectedTime,
  timeSlots,
}) => {
  return (
    <div className="time-section">
      <h2 className="section-title">시간 선택</h2>
      {timeSlots && timeSlots.length > 0 ? (
        <div className="time-slots">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              onClick={() => setSelectedTime(slot.time)}
              className={`time-slot ${
                selectedTime === slot.time ? "selected" : ""
              } ${!slot.isAvailable ? "unavailable" : ""}`}
              disabled={!slot.isAvailable}
            >
              {slot.time}
            </button>
          ))}
        </div>
      ) : (
        <p className="time-guide">&quot;날짜와 테마&quot;를 선택해 주세요.</p>
      )}
    </div>
  );
};

export default ReservationTimeSection;
