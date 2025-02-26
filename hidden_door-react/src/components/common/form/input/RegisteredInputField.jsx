import LabeledInputField from "@components/common/form/input/LabeledInputField";
import { formatPhoneNumber } from "@utils/format/number.js";

const RegisteredInputField = (props) => {
  const handleInput = (e) => {
    if (props.inputProps.type === "tel") {
      const formattedPhoneNumber = formatPhoneNumber(e.target.value);
      e.target.value = formattedPhoneNumber;
    }
  };

  return (
    <div className="form-container column">
      <LabeledInputField
        {...props}
        inputElement={
          <input
            {...props.inputProps}
            {...props.register}
            onInput={handleInput}
          />
        }
      />
    </div>
  );
};

export default RegisteredInputField;
