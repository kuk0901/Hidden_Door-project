const ReservationDetail = ({ reservationDetail }) => {
  if (!reservationDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="reservation-detail">
      <h1>예약 상세 정보</h1>
      <p>테마 id: {reservationDetail.themeId}</p>
      <p>성함: {reservationDetail.name}</p>
      <p>연락처: {reservationDetail.phone}</p>
      <p>이메일: {reservationDetail.email}</p>
      <p>예약 날짜: {reservationDetail.kstResDate}</p>
    </div>
  );
};

export default ReservationDetail;
