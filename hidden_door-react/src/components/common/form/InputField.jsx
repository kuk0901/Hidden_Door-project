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
  themeForm
}) => {
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
            <input
              id={id}
              type={type}
              {...register}
              placeholder={placeholder}
              className={`input input__${className}`}
              required
              {...(onChange ? { onChange } : {})}
            />
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
            <input
              id={id}
              type={type}
              {...register}
              placeholder={placeholder}
              className={`input input__${className}`}
            />
          </div>
        </div>

        {error && <InputError error={error} />}
      </div>
    );
  }

  if (themeForm) {
    return (
      <div className="container">
        <div className={`label-container text-center`}>
          <label htmlFor={id}>
            <span className="text--red">*</span>
            {label}
          </label>
        </div>
        <div className={`input-container input-container__${className}`}>
          <input
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            className={`input input__${className}`}
            required
            {...(onChange ? { onChange } : {})}
          />
        </div>
        {error && <InputError error={error} />}
      </div>
    );
  }

  return (
    <div className="column">
      <div className={`input-container input-container__${className}`}>
        <input
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={`input input__${className}`}
          required
          {...(onChange ? { onChange } : {})}
        />
      </div>
      {error && <InputError error={error} />}
    </div>
  );
};

export default InputField;
