import InputError from "@components/error/InputError";

const RegisteredThemeTextareaField = ({
  register,
  id,
  label,
  name,
  placeholder,
  rows,
  className,
  error
}) => (
  <div className="form-container column">
    <div className="container">
      <div className={`label-container text-center`}>
        <label htmlFor={id}>
          <span className="text--red">*</span>
          {label}
        </label>
      </div>
      <div className={`textarea-container textarea-container__${className}`}>
        <textarea
          id={id}
          {...register(name, { required: true })}
          placeholder={placeholder}
          rows={rows}
          className={`textarea__${className}`}
          required
        />
      </div>
    </div>
    {error && <InputError error={error} />}
  </div>
);

export default RegisteredThemeTextareaField;
