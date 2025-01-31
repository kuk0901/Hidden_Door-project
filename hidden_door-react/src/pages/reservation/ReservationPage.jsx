import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";
import ReservationList from "../../components/reservation/ReservationList";

const ReservationPage = () => {
  const [reservationList, setReservationList] = useState({});

  const getAllReservation = async () => {
    try {
      const res = await Api.get("/api/v1/reservations/list");

      console.log(res.data.data);
      console.log(res.data.msg);

      setReservationList(res.data.data);
    } catch (error) {
      toast.error(error.message || "오류입니다");
    }
  };

  useEffect(() => {
    getAllReservation();
  }, []);

  return (
    <>
      <section>
        <ReservationList reservationList={reservationList} />
      </section>
    </>
  );
};

export default ReservationPage;
