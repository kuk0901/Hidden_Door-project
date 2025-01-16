import InputError from "@components/error/InputError";

// FIXME: label 추가 고려 -> 컴포넌트로 분리 고민
const InputField = ({
  register,
  type,
  placeholder,
  error,
  className,
  value,
  onChange,
  id,
  label
}) => {
  if (register) {
    return (
      <div className="column">
        <div className="container">
          <div className={`label-container`}>
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
  } else {
    return (
      <div className="column">
        <div className={`input-container input-container__${className}`}>
          <input
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            className={`input input__${className}`}
          />
        </div>
        {error && <InputError error={error} />}
      </div>
    );
  }
};

export default InputField;
