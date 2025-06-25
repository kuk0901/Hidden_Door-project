import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ReservationSummarySkeleton = () => (
  <section className="reservation-summary-container">
    <div className="reservation-summary-div">
      <div className="reservation-summary">
        <h1>
          <Skeleton width={120} />
        </h1>
        {Array.from({ length: 8 }).map((_, i) => (
          <p key={i}>
            <Skeleton width="80%" height={24} />
          </p>
        ))}
      </div>
      <div className="button-container">
        <Skeleton width={180} height={48} />
      </div>
    </div>
  </section>
);

export default ReservationSummarySkeleton;
