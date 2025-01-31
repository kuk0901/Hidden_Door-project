import RegisteredThemeTextareaField from "@components/common/form/textarea/RegisteredThemeTextareaField";
import RegisteredTextareaField from "@components/common/form/textarea/RegisteredTextareaField";
import ThemeTextareaField from "@components/common/form/textarea/ThemeTextareaField";
import BaseTextareaField from "@components/common/form/textarea/BaseTextareaField";

const TextareaField = ({ register, themeForm, ...props }) => {
  if (register && themeForm) {
    return <RegisteredThemeTextareaField register={register} {...props} />;
  }
  if (register) {
    return <RegisteredTextareaField register={register} {...props} />;
  }
  if (themeForm) {
    return <ThemeTextareaField {...props} />;
  }
  return <BaseTextareaField {...props} />;
};

export default TextareaField;
