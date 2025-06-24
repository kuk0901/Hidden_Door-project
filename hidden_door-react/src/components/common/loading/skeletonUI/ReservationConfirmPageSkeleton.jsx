import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ReservationConfirmPageSkeleton = () => (
  <section className="reservation-confirm-page">
    <h1>
      <Skeleton width={120} height={32} />
    </h1>

    <form>
      <div className="reservation-details">
        {/* 날짜 */}
        <div className="form-group">
          <label>
            <Skeleton width={60} />
          </label>
          <div>
            <Skeleton width={150} height={24} />
          </div>
        </div>

        {/* 시간 */}
        <div className="form-group">
          <label>
            <Skeleton width={60} />
          </label>
          <div>
            <Skeleton width={100} height={24} />
          </div>
        </div>

        {/* 테마명 */}
        <div className="form-group">
          <label>
            <Skeleton width={60} />
          </label>
          <div>
            <Skeleton width={180} height={24} />
          </div>
        </div>

        {/* 성함 */}
        <div className="form-group">
          <label>
            <Skeleton width={60} />
          </label>
          <Skeleton height={32} />
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label>
            <Skeleton width={60} />
          </label>
          <Skeleton height={32} />
        </div>

        {/* 휴대폰 */}
        <div className="form-group">
          <label>
            <Skeleton width={60} />
          </label>
          <Skeleton height={32} />
        </div>

        {/* 인원 수 (select) */}
        <div className="form-group">
          <label>
            <Skeleton width={60} />
          </label>
          <Skeleton width={100} height={32} />
        </div>

        {/* 총 가격 */}
        <div className="form-group">
          <label>
            <Skeleton width={60} />
          </label>
          <div>
            <Skeleton width={120} height={24} />
          </div>
        </div>

        {/* 버튼 */}
        <Skeleton width={120} height={40} style={{ marginTop: 20 }} />
      </div>
    </form>
  </section>
);

export default ReservationConfirmPageSkeleton;
