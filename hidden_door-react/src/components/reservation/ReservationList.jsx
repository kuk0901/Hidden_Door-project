import ReservationItem from "./ReservationItem";

const ReservationList = ({ reservationList }) => {
  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <div>예약날짜</div>
        <div>성함</div>
        <div>테마명</div>
        <div>날짜</div>
      </div>
      {reservationList.map((reservation) => (
        <ReservationItem
          key={reservation.reservationId}
          reservation={reservation}
        />
      ))}
    </div>
  );
};

export default ReservationList;
