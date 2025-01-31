import LabeledInputField from "@components/common/form/input/LabeledInputField";

const ThemeInputField = (props) => {
  return (
    <LabeledInputField
      {...props}
      className="theme-input-container"
      label={
        <>
          <span className="text--red">*</span>
          {props.label}
        </>
      }
      inputElement={<input {...props.inputProps} />}
    />
  );
};

export default ThemeInputField;
