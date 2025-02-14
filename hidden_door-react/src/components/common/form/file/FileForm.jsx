import InputField from "@components/common/form/input/InputField";
import SubmitButton from "@components/common/form/SubmitButton";
import TextareaField from "@components/common/form/textarea/TextareaField";

const FileForm = ({
  onSubmit,
  fields,
  formData,
  onInputChange,
  btnText,
  errors,
  id
}) => {
  const renderField = (field) => {
    const commonProps = {
      name: field.name,
      placeholder: field.placeholder,
      error: errors[field.name] || field.errorMessage,
      className: field.className || "",
      label: field.label,
      themeForm: field.themeForm,
      id: field.id,
      onChange: field.type === "file" ? field.onChange : onInputChange,
      required: field.required
    };

    if (field.type !== "file") {
      commonProps.value = formData[field.name] || "";
    }

    if (field.type === "file" && field.onChange) {
      return (
        <InputField
          key={field.name}
          {...commonProps}
          type={field.type}
          onChange={(e) => field.onChange(e.target.files[0])}
          value={undefined}
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
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className="flex form-container"
    >
      {fields.map(renderField)}
      {errors.genres && <div className="error">{errors.genres}</div>}
      {btnText ? <SubmitButton text={btnText} /> : null}
    </form>
  );
};

export default FileForm;
