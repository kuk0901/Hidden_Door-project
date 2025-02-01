import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const LinkContainer = ({ linkList, onClick }) => {
  const linkListEls = linkList.map((el) => (
    <li key={uuidv4()}>
      <Link to={el.route} className="link-item" onClick={onClick}>
        {el.value}
      </Link>
    </li>
  ));

  return <>{linkListEls}</>;
};

export default LinkContainer;
