// line chart
import { ResponsiveLine } from "@nivo/line";
import { stringToColor } from "@utils/color/stringToColor";
import styles from "./dayReservationChart.module.scss";
import { memo } from "react";

const DayReservationChart = ({ data }) => {
  // 차트, 차트 헤더용 데이터
  const themeNames = [
    ...new Set(
      data.flatMap((day) => day.themeReservations.map((t) => t.themeName))
    )
  ];

  // 차트 헤더용 데이터
  const sortedData = themeNames
    .map((themeName) => ({
      themeId: themeName,
      themeName,
      totalReservations: data.reduce(
        (sum, day) =>
          sum +
          (day.themeReservations.find((t) => t.themeName === themeName)
            ?.reservations || 0),
        0
      )
    }))
    .sort((a, b) => b.totalReservations - a.totalReservations);

  const total = sortedData.reduce(
    (sum, item) => sum + item.totalReservations,
    0
  );

  // 차트용 데이터
  const themeColors = themeNames.reduce(
    (acc, theme) => ({
      ...acc,
      [theme]: stringToColor(theme)
    }),
    {}
  );

  const maxY = Math.max(
    ...data.flatMap((day) => day.themeReservations.map((t) => t.reservations))
  );

  const chartData = themeNames.map((themeName) => ({
    id: themeName,
    data: data.map((day) => ({
      x: new Date(day.localDate + "T00:00:00"),
      y:
        day.themeReservations.find((t) => t.themeName === themeName)
          ?.reservations || 0
    }))
  }));

  return (
    <div className={styles.container}>
      <div className={styles.summary_card}>
        <div className={styles.card_header}>
          <h4 className={styles.content}>주간 테마별 누적 예약</h4>
          <span className={styles.content_span}>총 {total}건</span>
        </div>

        {sortedData.length > 0 ? (
          <ul className={styles.card_list}>
            {sortedData.map((item) => (
              <li key={item.themeName} className={styles.card_item}>
                <div
                  className={styles.card_color}
                  style={{
                    background: themeColors[item.themeName]
                  }}
                />
                <span className={styles.themeName}>{item.themeName}</span>
                <div className={styles.reservation_container}>
                  <b>{item.totalReservations}건</b>
                  {item.totalReservations > 0 && (
                    <span className={styles.total_reservation}>
                      ({Math.round((item.totalReservations / total) * 100)}%)
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="none__content">
            차트에서 사용할 테마 / 예약 데이터가 존재하지 않습니다.
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className={styles.line_chart}>
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 110, bottom: 70, left: 60 }}
            xScale={{
              type: "time",
              format: "%Y-%m-%dT%H:%M:%S",
              precision: "day",
              useUTC: false
            }}
            yScale={{
              type: "linear",
              min: 0,
              max: Math.ceil(maxY + 2),
              stacked: false // 누적 차트 해제
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              format: "%m-%d",
              tickValues: data.map(
                (day) => new Date(day.localDate + "T00:00:00")
              ),
              tickSize: 5,
              tickPadding: 5,
              legend: "날짜",
              legendOffset: 40,
              legendPosition: "middle"
            }}
            axisLeft={{
              tickValues: Array.from(
                { length: Math.ceil(maxY) + 1 },
                (_, i) => i
              ),
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "예약수",
              legendOffset: -40,
              legendPosition: "middle"
            }}
            colors={(bar) => themeColors[bar.id]}
            pointSize={10}
            pointBorderWidth={2}
            useMesh={true}
            tooltip={({ point }) => <CustomTooltip point={point} data={data} />}
          />
        </div>
      )}
    </div>
  );
};

const CustomTooltip = memo(({ point, data }) => {
  if (point.data.y == 0) {
    return null;
  }

  // 현재 날짜의 전체 예약수 계산
  const currentDate = point.data.x;

  const currentDayData = data.find(
    (day) =>
      new Date(day.localDate + "T00:00:00").getTime() === currentDate.getTime()
  );

  if (!currentDayData?.themeReservations) {
    return (
      <div className={styles.tooltip}>
        <div>데이터를 찾을 수 없습니다</div>
      </div>
    );
  }

  const dailyTotal = currentDayData.themeReservations.reduce(
    (sum, t) => sum + t.reservations,
    0
  );

  return (
    <div className={styles.tooltip} style={{ borderColor: point.color }}>
      <div className={styles.tooltip_themeName}>
        <div className={styles.color} style={{ background: point.color }} />
        <strong>{point.serieId}</strong>
      </div>
      <div className={styles.reservation}>
        예약:{" "}
        <b>
          {point.data.y}건 ({point.data.y}/{dailyTotal} ·&nbsp;
          {Math.round((point.data.y ?? 0 / dailyTotal) * 100)}%)
        </b>
      </div>
    </div>
  );
});

CustomTooltip.displayName = "CustomTooltip";

export default DayReservationChart;
