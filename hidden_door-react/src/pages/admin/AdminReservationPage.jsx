import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";
import Pagination from "@components/common/navigation/pagination/Pagination";
import ReservationList from "../../components/reservation/ReservationList";

const AdminReservationPage = () => {
  const [reservationList, setReservationList] = useState([]);
  const [page, setPage] = useState(
    location.state?.page || {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      isFirst: true,
      isLast: true,
      sortField: "reservationCreDate",
      sortDirection: "ASC"
    }
  );

  const getAllReservation = async (newPage = 1) => {
    try {
      const { size, sortField, sortDirection } = page;
      const res = await Api.get("/reservations/list", {
        params: {
          page: newPage,
          size,
          sortField,
          sortDirection
        }
      });

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setReservationList(res.data.data);
      setPage(res.data.pageDto);
    } catch (error) {
      toast.error(error.message || "오류입니다.");
    }
  };

  const handlePageChange = (newPage) => {
    getAllReservation(newPage);
  };

  useEffect(() => {
    getAllReservation();
  }, []);

  return (
    <>
      <section className="admin-reservation-page">
        {/* XXX: 페이지 알려주는 div 태그 대신 검색 기능 추가해주세요~ */}
        <div>예약 확인 페이지</div>

        <div className="reservation-list-container">
          <ReservationList reservationList={reservationList} />
        </div>
        <Pagination page={page} onPageChange={handlePageChange} />
      </section>

      <div></div>
    </>
  );
};

export default AdminReservationPage;
