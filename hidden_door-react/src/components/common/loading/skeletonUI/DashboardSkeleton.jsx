import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardSkeleton = () => {
  return (
    <>
      <section className="theme-day-res-skeleton">
        <Skeleton
          className="summary-skeleton"
          baseColor="#666"
          highlightColor="#888"
        />
        <Skeleton
          className="chart-skeleton"
          baseColor="#666"
          highlightColor="#888"
        />
      </section>
      <section className="total-res-skeleton">
        <Skeleton
          className="chart-skeleton"
          baseColor="#666"
          highlightColor="#888"
        />
      </section>
      <section className="day-res-skeleton">
        <Skeleton
          className="summary-skeleton"
          baseColor="#666"
          highlightColor="#888"
        />
        <Skeleton
          className="chart-skeleton"
          baseColor="#666"
          highlightColor="#888"
        />
      </section>
    </>
  );
};

export default DashboardSkeleton;
