import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";
import Pagination from "@components/common/navigation/pagination/Pagination";
import ReservationList from "../../components/reservation/ReservationList";
import SearchForm from "@components/common/form/SearchForm";
import { useLocation } from "react-router-dom";
import ReservationMainPageSkeleton from "@components/common/loading/skeletonUI/ReservationMainPageSkeleton";

const AdminReservationPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

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
      sortDirection: "ASC",
    }
  );

  const [search, setSearch] = useState(
    location.state?.search || {
      searchField: "",
      searchTerm: "",
    }
  );

  useEffect(() => {
    if (location.state?.page || location.state?.search) {
      setPage(location.state.page);
      setSearch(location.state.search);
      getAllReservation(
        location.state.page.page,
        location.state.search.searchField,
        location.state.search.searchTerm
      );
    } else {
      getAllReservation();
    }
  }, [location.state]);

  const getAllReservation = async (
    newPage = 1,
    searchField = "",
    searchTerm = ""
  ) => {
    try {
      const { size, sortField, sortDirection } = page;
      const res = await Api.get("/reservations/list", {
        params: {
          page: newPage,
          size,
          sortField,
          sortDirection,
          searchField,
          searchTerm,
        },
      });

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setReservationList(res.data.data);

      setPage({
        ...res.data.pageDto,
        sortField,
        sortDirection,
      });

      setSearch({
        searchField: res.data.searchField,
        searchTerm: res.data.searchTerm,
      });
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "오류입니다.");
    }
  };

  const handleSearch = (searchField, searchTerm) => {
    getAllReservation(
      1,
      searchField,
      searchTerm,
      page.sortField,
      page.sortDirection
    );
  };

  const handlePageChange = (newPage) => {
    getAllReservation(
      newPage,
      search.searchField,
      search.searchTerm,
      page.sortField,
      page.sortDirection
    );
  };

  const handleReset = () => {
    setSearch({ searchField: "", searchTerm: "" });
    getAllReservation(1, "", "", page.sortField, page.sortDirection);
  };

  const searchFields = [
    { value: "", label: "검색 필드 선택" },
    { value: "name", label: "성함" },
    { value: "themeName", label: "테마명" },
  ];

  return loading ? (
    <ReservationMainPageSkeleton />
  ) : (
    <>
      <section className="admin-reservation-page">
        <div>
          <SearchForm
            onSearch={handleSearch}
            fields={searchFields}
            initialValues={search}
            onReset={handleReset}
          />
        </div>

        <div className="reservation-list-container">
          <ReservationList
            reservationList={reservationList}
            page={page}
            search={search}
          />
        </div>
        <Pagination page={page} onPageChange={handlePageChange} />
      </section>

      <div></div>
    </>
  );
};

export default AdminReservationPage;
