import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

LinkContainer.propTypes = {
  linkList: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  )
};

const LinkContainer = ({ linkList }) => {
  const linkListEls = linkList.map((el) => (
    <Link key={uuidv4()} to={el.route} className="link-item btn tertiary">
      {el.value}
    </Link>
  ));

  return <div className="link-container">{linkListEls}</div>;
};

export default LinkContainer;
