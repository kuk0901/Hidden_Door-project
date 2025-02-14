import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import ReservationDetail from "../../components/reservation/ReservationDetail.jsx";

const ReservationDetailPage = () => {
  const { reservationId } = useParams();
  const [reservationDetail, setReservationDetail] = useState(null);

  const getReservationDetail = async () => {
    try {
      const res = await Api.get(`/api/v1/reservations/${reservationId}`);
      setReservationDetail(res.data.data);
    } catch (error) {
      toast.error(error.message || "오류입니다.");
    }
  };

  useEffect(() => {
    getReservationDetail();
  }, [reservationId]);

  return (
    <div className="reservation-detail-container">
      <ReservationDetail reservationDetail={reservationDetail} />
    </div>
  );
};

export default ReservationDetailPage;
