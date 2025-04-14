import DayReservationChart from "@components/chart/DayReservationChart";
import ThemeDayReservationChart from "@components/chart/ThemeDayReservationChart";
import ThemeTotalReservationChart from "@components/chart/ThemeTotalReservationChart";
import { useEffect, useState } from "react";
import Api from "@axios/api";
import { toast } from "react-toastify";
import _ from "lodash";
import DashboardSkeleton from "@components/common/loading/skeletonUI/DashboardSkeleton";

const DATA_KEYS = {
  THEME_DAY: "themeDayReservations",
  THEME_TOTAL: "themeTotalReservations",
  DAY: "dailyThemeReservations"
};

const NONE_DATA_KEYS = {
  THEME_DAY: "오늘 방문 예약 현황",
  THEME_TOTAL: "테마별 누적 예약",
  DAY: "주간 테마별 누적 예약"
};

const DashboardPage = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const getChartData = async () => {
    try {
      const res = await Api.get("/monitoring/dashboard");

      if (res.status !== 200) {
        toast.error(
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        setLoading(false);
        return;
      }

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
      return (
        <div className="chart__none">
          {NONE_DATA_KEYS[dataKey] && (
            <div className="none__title">{NONE_DATA_KEYS[dataKey]}</div>
          )}

          <div className="none__content">
            차트에서 사용할 테마 / 예약 데이터가 존재하지 않습니다.
          </div>
        </div>
      );
    return <Component data={chartData[dataKey]} />;
  };

  return (
    <>
      {loading ? (
        <DashboardSkeleton />
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
