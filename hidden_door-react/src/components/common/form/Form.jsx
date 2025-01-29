import { useForm } from "react-hook-form";
import InputField from "./input/InputField";
import SubmitButton from "./SubmitButton";
import TextareaField from "./textarea/TextareaField";
import { validationRules } from "../../../validation/validationRules";

const Form = ({ onSubmit, fields, btnText }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const renderField = (field) => {
    const commonProps = {
      register: register(field.name, validationRules[field.name] || {}), // 유효성 검사 규칙 적용
      name: field.name,
      placeholder: field.placeholder,
      error: errors[field.name]?.message,
      className: field.className || "",
      id: field.id,
      label: field.label,
      type: field.type
    };

    return field.field === "textarea" ? (
      <TextareaField key={field.name} {...commonProps} />
    ) : (
      <InputField key={field.name} {...commonProps} type={field.type} />
    );
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data, reset);
      })}
      className="flex form-container"
    >
      {fields.map(renderField)}
      {btnText ? <SubmitButton text={btnText} /> : null}
    </form>
  );
};

export default Form;
