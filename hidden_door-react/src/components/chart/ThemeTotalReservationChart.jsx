import { ResponsivePie } from "@nivo/pie";
import { stringToColor } from "@utils/color/stringToColor";
import styles from "./themeTotalReservationChart.module.scss";

const ThemeTotalReservationChart = ({ data }) => {
  const sortedData = [...data].sort(
    (a, b) => b.totalReservations - a.totalReservations
  );
  const total = sortedData.reduce(
    (sum, item) => sum + item.totalReservations,
    0
  );

  return (
    <div className={styles.container}>
      {/* 1. 컴팩트 요약판 (카드형) */}
      <div className={styles.summary_card}>
        <div className={styles.card_header}>
          <h4 className={styles.content}>테마별 누적 예약</h4>
          <span className={styles.content_span}>총 {total}건</span>
        </div>

        {/* 시맨틱 리스트 적용 */}
        <ul className={styles.card_list}>
          {sortedData.map((item) => (
            <li key={item.themeId} className={styles.card_item}>
              <span
                className={styles.color_span}
                style={{
                  backgroundColor: stringToColor(item.themeName)
                }}
              />
              <span className={styles.themeName}>{item.themeName}</span>
              <div className={styles.reservation_container}>
                <b>{item.totalReservations}건</b>
                {total !== 0 && (
                  <span className={styles.total_reservation}>
                    ({Math.round((item.totalReservations / total) * 100)}%)
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pie Chart */}
      {total != 0 && (
        <div className={styles.pie_chart}>
          <ResponsivePie
            data={sortedData.map((item) => ({
              id: item.themeName,
              label: item.themeName,
              value: item.totalReservations,
              color: stringToColor(item.themeName),
              themeId: item.themeId,
              originalData: item
            }))}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.3}
            padAngle={1}
            cornerRadius={8}
            activeOuterRadiusOffset={12}
            colors={{ datum: "data.color" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
            enableArcLinkLabels={false}
            theme={{
              labels: {
                text: {
                  fontSize: 18,
                  fill: "#fff",
                  fontWeight: 700
                }
              }
            }}
            tooltip={({ datum }) => {
              const original = datum.data.originalData;
              return (
                <div
                  className={styles.tooltip}
                  style={{
                    borderColor: `${datum.color}`
                  }}
                >
                  <div className={styles.tooltip_themeName}>
                    <div
                      className={styles.color}
                      style={{
                        background: datum.color
                      }}
                    />
                    <strong>{original.themeName}</strong>
                  </div>
                  <div>
                    예약: <b>{original.totalReservations}건</b>
                  </div>
                  <div>
                    비율:{" "}
                    <b>
                      {Math.round((original.totalReservations / total) * 100)}%
                    </b>
                  </div>
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ThemeTotalReservationChart;
