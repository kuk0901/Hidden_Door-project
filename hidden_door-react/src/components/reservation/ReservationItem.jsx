import { useNavigate } from "react-router-dom";

const ReservationItem = ({ reservation, page, search }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hidden_door/admin/reservation/${reservation.reservationId}`, {
      state: { page, search },
    });
  };

  return (
    <li className="reservation--item">
      <button className="detail--link" onClick={handleClick}>
        <div className="content content__md">{reservation.kstResCreDate}</div>
        <div className="content content__sm">{reservation.name}</div>
        <div className="content content__md">{reservation.themeName}</div>
        <div className="content content__lg">{reservation.kstResDate}</div>
      </button>
    </li>
  );
};

export default ReservationItem;
