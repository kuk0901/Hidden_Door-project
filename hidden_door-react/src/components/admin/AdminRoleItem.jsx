import { formatRole } from "@utils/format/role";

const AdminRoleItem = ({ roles }) => {
  const filteredRoles = roles.filter((r) => r !== "ROLE_USER");

  return (
    <div className="admin--detail--item">
      <div className="admin--detail--label">역할</div>
      <div className="admin--detail--value">
        {filteredRoles.map((r, i, arr) => (
          <span key={i} className="role">
            {formatRole(r)}
            {i < arr.length - 1 ? ",\u00A0" : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AdminRoleItem;
