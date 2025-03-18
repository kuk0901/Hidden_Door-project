import { formatRole } from "@utils/format/role";

const AdminRoleInputItem = ({ roles }) => {
  const filteredRoles = roles.filter((r) => r !== "ROLE_USER");

  return (
    <div className="form-container column">
      <div className="container m">
        <div className="label-container text-center">
          <div className="role--label">역할</div>
        </div>

        <div className="input-container">
          <div className="input input__m admin--detail--value">
            {filteredRoles.map((r, i, arr) => (
              <span key={i} className="role">
                {formatRole(r)}
                {i < arr.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoleInputItem;
