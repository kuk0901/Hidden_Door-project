import InputError from "@components/error/InputError";

const RegisteredTextareaField = ({
  register,
  name,
  placeholder,
  rows,
  className,
  error
}) => (
  <div className={`textarea-container textarea-container__${className}`}>
    <textarea
      {...register(name, { required: true })}
      placeholder={placeholder}
      rows={rows}
      className={`textarea__${className}`}
    />
    {error && <InputError error={error} />}
  </div>
);

export default RegisteredTextareaField;
