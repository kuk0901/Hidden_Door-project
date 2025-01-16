import PropTypes from "prop-types";

import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SubmitButton from "../../SubmitButton";
import TextareaField from "../TextareaField";

FileForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      placeholder: PropTypes.string,
      errorMessage: PropTypes.string,
      className: PropTypes.string,
      field: PropTypes.oneOf(["input", "textarea"])
    })
  ).isRequired,
  btnText: PropTypes.string.isRequired
};

// FIXME: file form 작성
const FileForm = ({ onSubmit, fields, btnText }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const renderField = (field) => {
    const commonProps = {
      register,
      name: field.name,
      placeholder: field.placeholder,
      error: errors[field.name] && field.errorMessage,
      className: field.className || ""
    };

    return field.field === "textarea" ? (
      <TextareaField key={field.name} {...commonProps} />
    ) : (
      <InputField key={field.name} {...commonProps} type={field.type} />
    );
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, reset))}
      className="flex form-container"
    >
      {fields.map(renderField)}
      <SubmitButton text={btnText} />
    </form>
  );
};

export default FileForm;
