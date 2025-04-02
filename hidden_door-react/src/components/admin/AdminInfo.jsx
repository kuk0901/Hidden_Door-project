import Button from "@components/common/buttons/Button";
import { Link } from "react-router-dom";

const AdminInfo = ({ adminId, adminName, handleLogout }) => {
  return (
    <ul className="admin--info__list">
      <li className="admin--info__item">
        <Link to={`admin/account/${adminId}`} className="link--item">
          {adminName}님
        </Link>
      </li>
      <li className="admin--info__item">
        <Button text="로그아웃" onClick={handleLogout} className="link--item" />
      </li>
    </ul>
  );
};

export default AdminInfo;
