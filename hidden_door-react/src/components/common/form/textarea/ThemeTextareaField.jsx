import InputError from "@components/error/InputError";

const ThemeTextareaField = ({
  id,
  label,
  name,
  placeholder,
  rows,
  className,
  value,
  onChange,
  error
}) => (
  <div className="container theme-textarea">
    <div className="label-container">
      <label htmlFor={id}>
        <span className="text--red">*</span>
        {label}
      </label>
    </div>
    <div className={`textarea-container textarea-container__${className}`}>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`textarea__${className}`}
        value={value}
        onChange={onChange}
        required
      />
    </div>
    {error && <InputError error={error} />}
  </div>
);

export default ThemeTextareaField;
