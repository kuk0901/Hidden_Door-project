import { useNavigate } from "react-router-dom";
import { adminLinkList } from "@routes/linkList";

const AdminMenu = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    onClose(); // 메뉴 닫기
    navigate(`/${route}`); // 페이지 이동
  };

  return (
    <ul className="admin-submenu">
      {adminLinkList.map((item, i) => (
        <li key={i} className="admin-submenu-item">
          <button
            onClick={() => handleNavigation(item.route)}
            className="link--item btn--no"
          >
            {item.value}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default AdminMenu;
