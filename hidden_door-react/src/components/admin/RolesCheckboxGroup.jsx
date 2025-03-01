const RolesCheckboxGroup = ({ roles, userRoles, setAdminData, disabled }) => {
  const handleChange = (event) => {
    const { value, checked } = event.target;
    setAdminData((prevData) => ({
      ...prevData,
      roles: checked
        ? [...prevData.roles, value]
        : prevData.roles.filter((role) => role !== value)
    }));
  };

  return (
    <div className="roles-checkbox-group">
      <div className="label-container role-label-container">
        <label htmlFor="">권한</label>
      </div>
      {roles.map((role) => (
        <div key={role} className="role-checkbox">
          <input
            type="checkbox"
            id={`role-${role}`}
            value={role}
            checked={userRoles.includes(role)}
            onChange={handleChange}
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
