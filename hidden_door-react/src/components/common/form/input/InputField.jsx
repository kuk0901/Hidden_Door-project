import BaseInputField from "./BaseInputField";
import RegisteredInputField from "./RegisteredInputField";
import RegisteredThemeInputField from "./RegisteredThemeInputField";
import ThemeInputField from "./ThemeInputField";

// FIXME: 리팩토링 필요
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
  max,
  autoFocus,
  required = true
}) => {
  const inputProps = {
    ...register,
    id,
    name,
    type,
    placeholder,
    className: `input input__${className}`,
    required,
    ...(type === "number" && min !== undefined && { min }),
    ...(type === "number" && max !== undefined && { max }),
    ...(onChange ? { onChange } : {}),
    ...(type !== "file" && value !== undefined && { value }),
    ...(autoFocus && { autoFocus: true })
  };

  if (register && themeForm) {
    return (
      <RegisteredThemeInputField
        inputProps={inputProps}
        register={register}
        label={label}
        id={id}
        error={error}
        className={className}
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
        className={className}
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
        className={className}
      />
    );
  }

  return (
    <BaseInputField
      inputProps={inputProps}
      error={error}
      className={className}
    />
  );
};

export default InputField;
