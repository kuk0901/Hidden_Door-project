import { ResponsivePie } from "@nivo/pie";

const ThemeTotalReservationChart = ({ data }) => {
  // 데이터 정렬 (예약 많은 순) + 총합 계산 -> 서버에서 처리 고려
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

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
          <h4 style={{ margin: 0 }}>테마별 누적 예약</h4>
          <span
            style={{
              background: "#e3f2fd",
              padding: "4px 8px",
              borderRadius: "16px",
              fontSize: "0.9em"
            }}
          >
            총 {total}건
          </span>
        </div>

        {sortedData.map((item) => (
          <div
            key={item.id}
            style={{
              marginBottom: "8px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                background: item.color, // 파이 차트와 색상 연동
                marginRight: "8px",
                borderRadius: "2px"
              }}
            />
            <span style={{ flex: 1 }}>{item.label}</span>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center"
              }}
            >
              <b>{item.value}건</b>
              <span
                style={{
                  color: "#666",
                  fontSize: "0.8em"
                }}
              >
                ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. 개선된 Pie Chart */}
      <div
        style={{
          flex: 1,
          height: "300px",
          minWidth: "300px",
          position: "relative"
        }}
      >
        <ResponsivePie
          data={sortedData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={1}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ datum: "data.color" }} // 아이템별 색상 적용
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]]
          }}
          tooltip={({ datum }) => (
            <div
              style={{
                padding: "8px 12px",
                background: "white",
                border: `2px solid ${datum.color}`,
                borderRadius: "4px",
                boxShadow: "0 3px 9px rgba(0,0,0,0.1)"
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
                <strong>{datum.label}</strong>
              </div>
              <div>
                예약: <b>{datum.value}건</b>
              </div>
              <div>
                비율: <b>{Math.round((datum.value / total) * 100)}%</b>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ThemeTotalReservationChart;
