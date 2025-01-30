import ReservationItem from "./ReservationItem";

const ReservationList = ({ reservationList }) => {
  return (
    <ul className="reservation-container">
      {reservationList.map((reservation) => (
        <ReservationItem key={reservation.id} reservation={reservation} />
      ))}
    </ul>
  );
};

export default ReservationList;
