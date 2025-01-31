import LabeledInputField from "@components/common/form/input/LabeledInputField";

const RegisteredInputField = (props) => {
  return (
    <div className="form-container column">
      <LabeledInputField
        {...props}
        inputElement={<input {...props.inputProps} {...props.register} />}
      />
    </div>
  );
};

export default RegisteredInputField;
