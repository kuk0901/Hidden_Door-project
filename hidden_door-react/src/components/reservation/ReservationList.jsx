import ReservationItem from "./ReservationItem";

const ReservationList = ({ reservationList, page, search }) => {
  return (
    <ul className="reservation--list">
      <li className="reservation--item">
        <div className="title title__md">예약 신청일</div>
        <div className="title title__sm">성함</div>
        <div className="title title__md">테마명</div>
        <div className="title title__lg">예약일</div>
      </li>
      {reservationList.map((reservation) => (
        <ReservationItem
          key={reservation.reservationId}
          reservation={reservation}
          page={page}
          search={search}
        />
      ))}
    </ul>
  );
};

export default ReservationList;
