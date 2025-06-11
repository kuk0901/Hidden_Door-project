import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Api from "@axios/api";
import { toast } from "react-toastify";
import ReservationDetail from "../../components/reservation/ReservationDetail.jsx";

const AdminReservationDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservationId } = useParams();
  const [reservationDetail, setReservationDetail] = useState(null);

  const getReservationDetail = async () => {
    try {
      const res = await Api.get(`reservations/${reservationId}`);

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setReservationDetail(res.data.data);
    } catch (error) {
      toast.error(error.message || "오류입니다.");
    }
  };

  useEffect(() => {
    getReservationDetail();
  }, [reservationId]);
  const handlePaymentStateChange = async (newState) => {
    try {
      const res = await Api.patch(`/reservations/${reservationId}/payment`, {
        paymentState: newState,
      });
      if (res.status !== 200) {
        toast.error("결제 상태 변경 실패");
        return;
      }
      setReservationDetail(res.data.data);
      toast.success("결제 상태가 변경되었습니다.");
    } catch (error) {
      toast.error(error.message || "결제 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleBack = () => {
    if (location.state && location.state.page && location.state.search) {
      navigate("/hidden_door/admin/reservation", {
        state: {
          page: location.state.page,
          search: location.state.search,
        },
      });
    } else {
      navigate("/hidden_door/admin/reservation");
    }
  };

  return (
    <div className="reservation-detail-container">
      <div>
        <ReservationDetail
          reservationDetail={reservationDetail}
          onPaymentStateChange={handlePaymentStateChange}
        />
      </div>

      <button onClick={handleBack} className="return-admin-reservation-list">
        돌아가기
      </button>
    </div>
  );
};

export default AdminReservationDetailPage;
