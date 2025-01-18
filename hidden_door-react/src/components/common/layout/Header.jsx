import { Link } from "react-router-dom";
import Button from "@components/common/Button";

const Header = ({ title, text, handleUpdate, reservation }) => {
  return (
    <header className="header">
      <h2 className="title">{title}</h2>
      {handleUpdate && text ? (
        <Button text={text} onClick={handleUpdate} />
      ) : null}
      {reservation ? <Link to="">예약하기</Link> : null}
    </header>
  );
};

export default Header;
