import ReservationItem from "./ReservationItem";

const ReservationList = ({ reservationList }) => {
  return (
    <ul className="reservation-container">
      {reservationList.map((reservation) => (
        <ReservationItem
          key={reservation.reservationId}
          reservation={reservation}
        />
      ))}
    </ul>
  );
};

export default ReservationList;
