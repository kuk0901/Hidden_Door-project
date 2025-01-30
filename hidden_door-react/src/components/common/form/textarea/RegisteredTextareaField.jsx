import InputError from "@components/error/InputError";

const RegisteredTextareaField = ({
  id,
  label,
  register,
  name,
  placeholder,
  rows,
  className,
  error
}) => (
  <div className="form-container">
    <div className="label-container">
      <label htmlFor={id}>{label}</label>
    </div>
    <div className={`textarea-container textarea-container__${className}`}>
      <textarea
        id={id}
        {...register}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`textarea__${className}`}
      />
      {error && <InputError error={error} />}
    </div>
  </div>
);

export default RegisteredTextareaField;
