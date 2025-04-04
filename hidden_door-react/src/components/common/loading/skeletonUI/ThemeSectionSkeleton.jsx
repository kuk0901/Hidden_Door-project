import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ThemeSectionSkeleton = () => {
  return (
    <section className="theme-section theme-section-skeleton">
      <div className="theme-page--theme-section">
        <ul className="theme--list">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="theme--item--skeleton">
              <Skeleton
                className="img-skeleton"
                baseColor="#666"
                highlightColor="#888"
              />

              <div className="btn-container-skeleton">
                <Skeleton
                  className="btn-skeleton"
                  baseColor="#666"
                  highlightColor="#888"
                ></Skeleton>
                <Skeleton
                  className="btn-skeleton"
                  baseColor="#666"
                  highlightColor="#888"
                ></Skeleton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ThemeSectionSkeleton;
