import { Link } from "react-router-dom";
import Button from "@components/common/buttons/Button";
import { useAdmin } from "@hooks/useAdmin";

const Header = ({ title, subtitle, text, handleUpdate, reservation }) => {
  const { admin } = useAdmin();

  return (
    <header className="header">
      <h2 className="header-container">
        <div className="title-container">
          <span className="title">&quot;{title}&quot;</span>
          {subtitle && <span className="subtitle">{subtitle}</span>}
        </div>

        <div className="link-container">
          {handleUpdate && text && admin ? (
            <Button
              text={text}
              onClick={handleUpdate}
              className="btn header--btn"
            />
          ) : null}
          {reservation ? (
            <Link to="" className="btn header--btn">
              예약하기
            </Link>
          ) : null}
        </div>
      </h2>
    </header>
  );
};

export default Header;
