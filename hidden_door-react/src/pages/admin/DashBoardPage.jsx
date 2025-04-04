import DayReservationChart from "@components/chart/DayReservationChart";
import ThemeDayReservationChart from "@components/chart/ThemeDayReservationChart";
import ThemeTotalReservationChart from "@components/chart/ThemeTotalReservationChart";
import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";
import _ from "lodash";
import Loading from "@components/common/loading/Loading";

const DATA_KEYS = {
  THEME_DAY: "themeDayReservations",
  THEME_TOTAL: "themeTotalReservations",
  DAY: "dayReservations"
};

const DashboardPage = () => {
  const [chartData, setChartData] = useState({}); // { key: [], key: [], key: [] } 형태
  const [loading, setLoading] = useState(false); // FIXME: true로 변경해야 함

  // FIXME: 임시 api 요청 형태
  const getChartData = async () => {
    try {
      const res = await Api.get();

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        setLoading(false);
        return;
      }

      console.log("response data: ", res.data.data);
      setChartData(res.data.data);
      setLoading(false);
    } catch (error) {
      toast.error(
        error.message ?? "차트 데이터를 가져오는 중 오류가 발생했습니다."
      );
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  const renderChartOrPlaceholder = (Component, dataKey) => {
    if (_.isEmpty(chartData?.[dataKey]))
      return <div className="chart__none">데이터가 없습니다</div>; // FIXME: 추후 컴포넌트로 변경 가능
    return <Component data={chartData[dataKey]} />;
  };

  return (
    <>
      {loading ? (
        // FIXME: 스켈레톤 ui로 대체
        <Loading />
      ) : (
        <>
          <section className="theme-day-reservation--section">
            {renderChartOrPlaceholder(
              ThemeDayReservationChart,
              DATA_KEYS.THEME_DAY
            )}
          </section>
          <section className="theme-total-reservation--section">
            {renderChartOrPlaceholder(
              ThemeTotalReservationChart,
              DATA_KEYS.THEME_TOTAL
            )}
          </section>
          <section className="day-reservation--section">
            {renderChartOrPlaceholder(DayReservationChart, DATA_KEYS.DAY)}
          </section>
        </>
      )}
    </>
  );
};

export default DashboardPage;
