import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import ReservationDetail from "../../components/reservation/ReservationDetail.jsx";

const AdminReservationDetailPage = () => {
  const { reservationId } = useParams();
  const [reservationDetail, setReservationDetail] = useState(null);

  const getReservationDetail = async () => {
    try {
      const res = await Api.get(`reservations/${reservationId}`);
      setReservationDetail(res.data.data);
    } catch (error) {
      toast.error(error.message || "오류입니다.");
    }
  };

  // FIXME : 예약 완료 후 나오는 summary 페이지 가져와서 날짜 및 예약 관련 3가지 추가하기
  useEffect(() => {
    getReservationDetail();
  }, [reservationId]);

  return (
    <div className="reservation-detail-container">
      <ReservationDetail reservationDetail={reservationDetail} />
    </div>
  );
};

export default AdminReservationDetailPage;
