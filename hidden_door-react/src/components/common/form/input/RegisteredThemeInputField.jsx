import LabeledInputField from "@components/common/form/input/LabeledInputField";

const RegisteredThemeInputField = (props) => {
  return (
    <div className="form-container">
      <LabeledInputField
        {...props}
        label={
          <>
            <span className="text--red">*</span>
            {props.label}
          </>
        }
        inputElement={<input {...props.inputProps} {...props.register} />}
      />
    </div>
  );
};

export default RegisteredThemeInputField;
