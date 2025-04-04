import { ResponsiveBar } from "@nivo/bar";

const ThemeDayReservationChart = ({ data }) => {
  // 데이터 정렬 (예약수 높은 순) -> 서버에서 처리 고려
  const sortedData = [...data].sort((a, b) => b.booked - a.booked);

  // 임시 UI
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* 1. 요약 헤더 */}
      <div
        style={{
          padding: "12px",
          background: "#f8f9fa",
          borderRadius: "8px",
          fontWeight: "bold"
        }}
      >
        오늘의 예약 현황 (총 {data.reduce((sum, item) => sum + item.booked, 0)}
        건)
      </div>

      {/* 2. 심플 테이블 (모바일 친화적) */}
      <div
        style={{
          overflowX: "auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px"
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "500px" // 모바일에서 가로 스크롤 방지
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f5f5f5",
                fontWeight: "600"
              }}
            >
              {["테마명", "예약/총량", "잔여", "진행률"].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "12px",
                    textAlign: header === "테마명" ? "left" : "center"
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr
                key={item.name}
                style={{
                  borderBottom: "1px solid #eee",
                  backgroundColor:
                    item.booked === item.total ? "#fff8e1" : "white" // 매진시 강조
                }}
              >
                <td style={{ padding: "12px" }}>{item.name}</td>
                <td style={{ textAlign: "center" }}>
                  <b>{item.booked}</b>/{item.total}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    color:
                      item.total - item.booked === 0 ? "#d32f2f" : "inherit"
                  }}
                >
                  {item.total - item.booked}개
                </td>
                <td style={{ padding: "0 12px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "8px",
                        background: "#e0e0e0",
                        borderRadius: "4px"
                      }}
                    >
                      <div
                        style={{
                          width: `${(item.booked / item.total) * 100}%`,
                          height: "100%",
                          background:
                            item.booked === item.total ? "#ffa000" : "#81c784",
                          borderRadius: "4px"
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.8em",
                        color: "#666"
                      }}
                    >
                      {Math.round((item.booked / item.total) * 100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. 심플 바 차트 */}
      <div style={{ height: "400px" }}>
        <ResponsiveBar
          data={sortedData}
          keys={["booked"]}
          indexBy="name"
          margin={{ top: 20, right: 20, bottom: 80, left: 60 }}
          padding={0.3}
          colors={
            ({ id, data }) =>
              data.total === data.booked ? "#ffa000" : "#81c784" // 매진시 색상 변경
          }
          axisBottom={{
            tickRotation: -45,
            legend: "테마명",
            legendPosition: "middle",
            legendOffset: 60
          }}
          axisLeft={{
            legend: "예약 수",
            legendPosition: "middle",
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          tooltip={({ id, value, data }) => (
            <div
              style={{
                padding: "8px 12px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              <strong>{id}</strong>
              <div>
                예약: {value}/{data.total} (
                {Math.round((value / data.total) * 100)}%)
              </div>
              {data.total === value && (
                <div style={{ color: "#d32f2f", fontWeight: "bold" }}>매진</div>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ThemeDayReservationChart;
