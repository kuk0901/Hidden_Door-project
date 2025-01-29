import InputError from "@components/error/InputError";

const BaseInputField = ({ inputProps, error }) => {
  return (
    <div className="column">
      <div
        className={`input-container input-container__${inputProps.className}`}
      >
        <input {...inputProps} />
      </div>
      {error && <InputError error={error} />}
    </div>
  );
};

export default BaseInputField;
