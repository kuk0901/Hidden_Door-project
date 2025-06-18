import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ReservationDetailSkeleton = () => (
  <div className="reservation-detail-container">
    <div className="reservation-detail">
      <h1>
        <Skeleton width={120} />
      </h1>
      {Array.from({ length: 11 }).map((_, i) => (
        <p key={i}>
          <Skeleton width="80%" height={22} />
        </p>
      ))}
    </div>
    <Skeleton width={160} height={48} style={{ margin: 10 }} />
  </div>
);

export default ReservationDetailSkeleton;
