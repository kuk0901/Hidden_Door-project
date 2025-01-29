import InputError from "@components/error/InputError";

const LabeledInputField = ({ label, id, inputElement, error, className }) => (
  <div className={`container ${className || ""}`}>
    <div className="label-container text-center">
      <label htmlFor={id}>{label}</label>
    </div>
    <div className={`input-container input-container__${className}`}>
      {inputElement}
    </div>
    {error && <InputError error={error} />}
  </div>
);

export default LabeledInputField;
