import BaseInputField from "./BaseInputField";
import RegisteredInputField from "./RegisteredInputField";
import RegisteredThemeInputField from "./RegisteredThemeInputField";
import ThemeInputField from "./ThemeInputField";

const InputField = ({
  register,
  type,
  placeholder,
  error,
  className,
  value,
  onChange,
  id,
  label,
  name,
  themeForm,
  min,
  max
}) => {
  const inputProps = {
    id,
    name,
    type,
    placeholder,
    className: `input input__${className}`,
    required: true,
    ...(type === "number" && min !== undefined && { min }),
    ...(type === "number" && max !== undefined && { max }),
    ...(onChange ? { onChange } : {}),
    ...(type !== "file" && value !== undefined && { value })
  };

  if (register && themeForm) {
    return (
      <RegisteredThemeInputField
        inputProps={inputProps}
        register={register}
        label={label}
        id={id}
        error={error}
      />
    );
  }

  if (register) {
    return (
      <RegisteredInputField
        inputProps={inputProps}
        register={register}
        label={label}
        id={id}
        error={error}
      />
    );
  }

  if (themeForm) {
    return (
      <ThemeInputField
        inputProps={inputProps}
        label={label}
        id={id}
        error={error}
      />
    );
  }

  return <BaseInputField inputProps={inputProps} error={error} />;
};

export default InputField;
