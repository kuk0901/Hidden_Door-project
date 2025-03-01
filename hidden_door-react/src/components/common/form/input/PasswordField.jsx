import { useState } from "react";
import LabeledInputField from "@components/common/form/input/LabeledInputField";

const PasswordField = ({ label, name, register, error, rules, className }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputElement = (
    <>
      <input
        className={`input input__${className}`}
        type={showPassword ? "text" : "password"}
        id={name}
        {...register(name, rules)}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="password-toggle-btn"
      >
        {showPassword ? "숨기기" : "보기"}
      </button>
    </>
  );

  return (
    <div className="form-container column">
      <LabeledInputField
        label={label}
        id={name}
        inputElement={inputElement}
        error={error}
        className={className}
      />
    </div>
  );
};

export default PasswordField;
