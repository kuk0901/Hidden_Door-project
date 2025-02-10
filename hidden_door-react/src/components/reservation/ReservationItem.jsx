import { useNavigate } from "react-router-dom";

const ReservationItem = ({ reservation }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hidden_door/reservation/${reservation.reservationId}`);
  };

  return (
    <div className="reservation-list--div" onClick={handleClick}>
      <div>{reservation.kstResCreDate}</div>
      <div>{reservation.name}</div>
      <div>{reservation.themeId}</div>
      <div>{reservation.kstResDate}</div>
    </div>
  );
};

export default ReservationItem;
