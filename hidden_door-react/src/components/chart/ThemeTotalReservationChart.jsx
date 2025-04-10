import { ResponsivePie } from "@nivo/pie";
import { stringToColor } from "@utils/color/stringToColor";

const ThemeTotalReservationChart = ({ data }) => {
  const sortedData = [...data].sort(
    (a, b) => b.totalReservations - a.totalReservations
  );
  const total = sortedData.reduce(
    (sum, item) => sum + item.totalReservations,
    0
  );

  // 임시 UI
  return (
    <div
      style={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // 모바일에서는 세로 배치
        gap: "20px",
        alignItems: "center"
      }}
    >
      {/* 1. 컴팩트 요약판 (카드형) */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          background: "#f8f9fa",
          borderRadius: "12px",
          minWidth: "250px"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
            alignItems: "center"
          }}
        >
          <h4 style={{ margin: 0, color: "#000" }}>테마별 누적 예약</h4>
          <span
            style={{
              background: "#e3f2fd",
              padding: "4px 8px",
              borderRadius: "16px",
              fontSize: "0.9em",
              color: "#000"
            }}
          >
            총 {total}건
          </span>
        </div>

        {sortedData.map((item) => (
          <div
            key={item.themeId}
            style={{
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              color: "#000"
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                marginRight: "8px",
                borderRadius: "2px",
                background: `${stringToColor(item.themeName)}`
              }}
            />
            <span style={{ flex: 1 }}>{item.themeName}</span>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center"
              }}
            >
              <b>{item.totalReservations}건</b>
              {total != 0 && (
                <span
                  style={{
                    color: "#666",
                    fontSize: "0.8em"
                  }}
                >
                  ({Math.round((item.totalReservations / total) * 100)}%)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. 개선된 Pie Chart */}
      {total != 0 && (
        <div
          style={{
            flex: 1,
            height: "300px",
            minWidth: "300px",
            minHeight: "250px",
            position: "relative"
          }}
        >
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
            tooltip={({ datum }) => {
              const original = datum.data.originalData;
              return (
                <div
                  style={{
                    padding: "8px 12px",
                    background: "white",
                    border: `2px solid ${datum.color}`,
                    borderRadius: "4px",
                    boxShadow: "0 3px 9px rgba(0,0,0,0.1)",
                    color: "#000"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "4px"
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        background: datum.color,
                        marginRight: "6px"
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
