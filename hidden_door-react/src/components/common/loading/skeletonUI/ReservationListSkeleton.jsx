import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ReservationListSkeleton = () => (
  <ul className="reservation--list">
    {/* 헤더 */}
    <li className="reservation--item">
      <div className="title title__md">
        <Skeleton width="80%" />
      </div>
      <div className="title title__sm">
        <Skeleton width="60%" />
      </div>
      <div className="title title__md">
        <Skeleton width="80%" />
      </div>
      <div className="title title__lg">
        <Skeleton width="80%" />
      </div>
    </li>
    {/* 리스트 아이템 */}
    {Array.from({ length: 8 }).map((_, i) => (
      <li className="reservation--item" key={i}>
        <div className="content content__md">
          <Skeleton width="80%" />
        </div>
        <div className="content content__sm">
          <Skeleton width="60%" />
        </div>
        <div className="content content__md">
          <Skeleton width="80%" />
        </div>
        <div className="content content__lg">
          <Skeleton width="80%" />
        </div>
      </li>
    ))}
  </ul>
);

export default ReservationListSkeleton;
