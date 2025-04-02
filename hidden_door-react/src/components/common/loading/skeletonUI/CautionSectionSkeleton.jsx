import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CautionSectionSkeleton = () => {
  return (
    <section className="section section--caution section--caution--skeleton">
      <div className="section--title text-center bold">주의사항</div>

      <div className="caution--list">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="caution--item--skeleton">
            {/* 아이콘 부분 */}
            <div className="icon-container">
              <Skeleton
                circle
                width={50}
                height={50}
                baseColor="#666"
                highlightColor="#888"
              />
            </div>

            {/* 텍스트 부분 */}
            <div className="content-container">
              <Skeleton
                className="caution--content--title"
                style={{ marginBottom: "10px" }}
                baseColor="#666"
                highlightColor="#888"
              />
              <Skeleton
                className="caution--content--text"
                baseColor="#666"
                highlightColor="#888"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CautionSectionSkeleton;
