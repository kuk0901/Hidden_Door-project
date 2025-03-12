import { Controller } from "react-hook-form";

const RolesCheckboxGroup = ({ roles, control, name, disabled }) => {
  return (
    <div className="roles-checkbox-group">
      <div className="label-container role-label-container">
        <label htmlFor="">권한</label>
      </div>

      <div className="checkbox-container">
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const { value, onChange } = field;

            const handleChange = (event) => {
              const { value: roleValue, checked } = event.target;
              const updatedRoles = checked
                ? [...value, roleValue]
                : value.filter((role) => role !== roleValue);
              onChange(updatedRoles);
            };

            return roles.map((role) => (
              <div key={role} className="role-checkbox">
                <input
                  type="checkbox"
                  id={`role-${role}`}
                  value={role}
                  checked={value.includes(role)}
                  onChange={handleChange}
                  disabled={disabled}
                  className="checkbox--role"
                />
                <label className="label--role" htmlFor={`role-${role}`}>
                  {role}
                </label>
              </div>
            ));
          }}
        />
      </div>
    </div>
  );
};

export default RolesCheckboxGroup;
