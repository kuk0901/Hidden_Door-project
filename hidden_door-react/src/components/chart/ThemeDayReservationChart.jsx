import styles from "./themeDayReservation.module.scss";
import { stringToColor } from "@utils/color/stringToColor";

const dummy = [
  { themeName: "theme1", reservations: 4, total: 8 },
  { themeName: "theme2", reservations: 5, total: 8 },
  { themeName: "theme3", reservations: 7, total: 8 },
  { themeName: "theme4", reservations: 8, total: 8 }
];

const ThemeDayReservationChart = ({ data = dummy }) => {
  const sortedData = [...data].sort((a, b) => b.reservations - a.reservations);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        오늘 방문 예약 현황 (총 &nbsp;
        {data.reduce((sum, item) => sum + item.reservations, 0)}건)
      </div>

      <div className={styles.listWrapper}>
        {/* 헤더 */}
        <ul className={styles.listHeader}>
          {["테마명", "예약/총량", "잔여", "진행률"].map((header) => (
            <li
              key={header}
              className={`${styles.listHeaderItem} ${
                header === "테마명" ? styles.leftAlign : ""
              }`}
            >
              {header}
            </li>
          ))}
        </ul>

        <ul className={styles.listContent}>
          {sortedData.map((item) => {
            const isSoldOut = item.reservations === item.total;
            return (
              <li
                key={item.themeName}
                className={`${styles.listItem} ${
                  isSoldOut ? styles.soldOut : ""
                }`}
              >
                <div className={styles.themeName}>
                  <span
                    className={styles.themeColor}
                    style={{
                      backgroundColor: `${stringToColor(item.themeName)}`
                    }}
                  ></span>{" "}
                  {item.themeName}
                </div>

                <div className={styles.reservationCount}>
                  <b>{item.reservations}</b>/{item.total}
                </div>

                <div
                  className={`${styles.remaining} ${
                    isSoldOut ? styles.soldOutText : ""
                  }`}
                >
                  {isSoldOut ? (
                    <span style={{ fontWeight: "bold" }}>매진</span>
                  ) : (
                    `${item.total - item.reservations}개`
                  )}
                </div>

                <div className={styles.progressWrapper}>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${
                        isSoldOut ? styles.soldOutProgress : ""
                      }`}
                      style={{
                        width: `${(item.reservations / item.total) * 100}%`
                      }}
                    />
                  </div>

                  <span className={styles.progressText}>
                    {Math.round((item.reservations / item.total) * 100)}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ThemeDayReservationChart;
