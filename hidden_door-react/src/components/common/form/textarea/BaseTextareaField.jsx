import InputError from "@components/error/InputError";

const BaseTextareaField = ({ name, placeholder, rows, className, error }) => {
  return (
    <div className={`textarea-container textarea-container__${className}`}>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`textarea__${className}`}
      />
      {error && <InputError error={error} />}
    </div>
  );
};

export default BaseTextareaField;
