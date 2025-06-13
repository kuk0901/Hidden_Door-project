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
                <div className={`${styles.div_flex} ${styles.themeName}`}>
                  <div className={styles.listItem_title}>테마명:</div>
                  <div>
                    <div
                      className={styles.themeColor}
                      style={{
                        backgroundColor: `${stringToColor(item.themeName)}`
                      }}
                    ></div>{" "}
                    {item.themeName}
                  </div>
                </div>

                <div
                  className={`${styles.div_flex} ${styles.reservationCount}`}
                >
                  <div className={styles.listItem_title}>예약/총량:</div>
                  <div>
                    <b>{item.reservations}</b>/{item.total}
                  </div>
                </div>

                <div
                  className={`${styles.div_flex}  ${styles.remaining} ${
                    isSoldOut ? styles.soldOutText : ""
                  }`}
                >
                  <div className={styles.listItem_title}>잔여:</div>
                  {isSoldOut ? (
                    <div style={{ fontWeight: "bold" }}>매진</div>
                  ) : (
                    <div className={styles.count}>
                      {item.total - item.reservations}개
                    </div>
                  )}
                </div>

                <div className={`${styles.div_flex} ${styles.progressWrapper}`}>
                  <div className={styles.listItem_title}>진행률:</div>
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
