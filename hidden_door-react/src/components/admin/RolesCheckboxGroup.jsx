const RolesCheckboxGroup = ({ roles, userRoles, onChange, disabled }) => {
  return (
    <div className="roles-checkbox-group">
      {roles.map((role) => (
        <div key={role} className="role-checkbox">
          <input
            type="checkbox"
            id={`role-${role}`}
            value={role}
            checked={userRoles.includes(role)}
            onChange={onChange}
            disabled={disabled}
            className="checkbox--role"
          />
          <label className="label--role" htmlFor={`role-${role}`}>
            {role}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RolesCheckboxGroup;
