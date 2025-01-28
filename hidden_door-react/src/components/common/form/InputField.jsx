import InputError from "@components/error/InputError";

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

  const inputElement = register ? (
    <input {...inputProps} {...register} />
  ) : (
    <input {...inputProps} />
  );

  // register와 themeForm이 동시에 있는 경우
  if (register && themeForm) {
    return (
      <div className="form-container">
        <div className="container">
          <div className={`label-container text-center`}>
            <label htmlFor={id}>
              <span className="text--red">*</span>
              {label}
            </label>
          </div>
          <div className={`input-container input-container__${className}`}>
            {inputElement}
          </div>
        </div>
        {error && <InputError error={error} />}
      </div>
    );
  }

  if (register) {
    return (
      <div className="form-container column">
        <div className="container">
          <div className={`label-container text-center`}>
            <label htmlFor={id}>{label}</label>
          </div>
          <div className={`input-container input-container__${className}`}>
            {inputElement}
          </div>
        </div>
        {error && <InputError error={error} />}
      </div>
    );
  }

  if (themeForm) {
    return (
      <div className="container theme-input-container">
        <div className={`label-container text-center`}>
          <label htmlFor={id}>
            <span className="text--red">*</span>
            {label}
          </label>
        </div>
        <div className={`input-container input-container__${className}`}>
          {inputElement}
        </div>
        {error && <InputError error={error} />}
      </div>
    );
  }

  return (
    <div className="column">
      <div className={`input-container input-container__${className}`}>
        {inputElement}
      </div>
      {error && <InputError error={error} />}
    </div>
  );
};

export default InputField;
