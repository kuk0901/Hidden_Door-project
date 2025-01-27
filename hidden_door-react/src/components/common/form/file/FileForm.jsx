import { useForm } from "react-hook-form";
import InputField from "@components/common/form/InputField";
import SubmitButton from "@components/common/form/SubmitButton";
import TextareaField from "@components/common/form/TextareaField";

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
      className: field.className || "",
      label: field.label,
      themeForm: field.themeForm,
      id: field.id
    };

    if (field.type === "file" && field.onChange) {
      return (
        <InputField
          key={field.name}
          {...commonProps}
          type={field.type}
          onChange={(e) => field.onChange(e.target.files[0])} // 파일 변경 시 핸들러 호출
        />
      );
    }

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
