import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ReservationMainSkeleton = () => (
  <section className="reservation-page reservation-skeleton">
    <h1 className="reservation-title">
      <Skeleton width={120} height={32} />
    </h1>
    <form className="reservation-form">
      <div className="form-section">
        {/* 날짜 선택 */}
        <div className="date-section">
          <h2 className="section-title">
            <Skeleton width={80} />
          </h2>
          <Skeleton height={240} width="100%" style={{ borderRadius: 8 }} />
        </div>
        {/* 테마 선택 */}
        <div className="theme-section">
          <h2 className="section-title">
            <Skeleton width={80} />
          </h2>
          <div className="theme-slots">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                height={44}
                width="100%"
                style={{ borderRadius: 5, marginBottom: 10 }}
              />
            ))}
          </div>
        </div>
        {/* 시간 선택 */}
        <div className="time-section">
          <h2 className="section-title">
            <Skeleton width={80} />
          </h2>
          <div className="time-slots">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                height={44}
                width="90%"
                style={{ borderRadius: 5, marginBottom: 10 }}
              />
            ))}
          </div>
        </div>
      </div>
      <Skeleton height={48} width={180} style={{ marginTop: 16 }} />
      <Skeleton height={48} width={180} style={{ marginTop: 8 }} />
    </form>
  </section>
);

export default ReservationMainSkeleton;
