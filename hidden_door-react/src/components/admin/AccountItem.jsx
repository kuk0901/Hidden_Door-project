import { useNavigate } from "react-router-dom";

const AccountItem = ({ page, search, adminData, role }) => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate(`/hidden_door/admin/account/${adminData.adminId}`, {
      state: { adminData, page, search }
    });
  };

  return (
    <button className="account--item" onClick={handleDetail}>
      <div className="content content--sm">{adminData.userName}</div>
      <div className="content content--md">{adminData.email}</div>
      <div className="content content--sm">{adminData.phone}</div>
      {role && (
        <div className="content content--lg roles-container">
          {adminData.roles
            .filter((r) => r !== "ROLE_USER")
            .map((r, i, arr) => (
              <span key={i} className="role">
                {r}
                {i < arr.length - 1 ? "," : ""}
              </span>
            ))}
        </div>
      )}
    </button>
  );
};

export default AccountItem;
