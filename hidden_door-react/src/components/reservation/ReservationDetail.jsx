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
      <p>
        결제 날짜:{" "}
        {reservationDetail.kstPayDate === ""
          ? "아직 결제가 되지 않았습니다"
          : reservationDetail.kstPayDate}
      </p>
    </div>
  );
};

export default ReservationDetail;
