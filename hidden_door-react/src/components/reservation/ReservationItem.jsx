const ReservationItem = ({ reservation }) => {
  return (
    <div className="reservation-list--div">
      <div>{reservation.kstResCreDate}</div>
      <div>{reservation.name}</div>
      <div>{reservation.themeId}</div>
      <div>{reservation.kstResDate}</div>
    </div>
  );
};

export default ReservationItem;
