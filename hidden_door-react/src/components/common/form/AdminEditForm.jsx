import { useForm } from "react-hook-form";
import InputField from "@components/common/form/input/InputField";
import PasswordField from "@components/common/form/input/PasswordField";
import RolesCheckboxGroup from "@components/admin/RolesCheckboxGroup";
import { useEffect } from "react";
import { validationRules } from "@validation/validationRules";

// FIXME: 작성 중
const AdminEditForm = ({
  adminData,
  onSubmit,
  setAdminData,
  availableRoles,
  isSuperAdmin
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setFocus
  } = useForm({
    mode: "onBlur"
  });

  useEffect(() => {
    if (adminData) {
      reset({
        userName: adminData.userName,
        email: adminData.email,
        phone: adminData.phone,
        roles: adminData.roles
      });
    }
  }, [adminData, reset]);

  const watchPassword = watch("pwd");

  const onFormSubmit = (data) => {
    if (!data.pwd) {
      delete data.pwd;
      delete data.pwdCheck;
    }

    onSubmit(data);
  };

  const inputFields = [
    {
      name: "userName",
      label: "이름",
      type: "text",
      rules: validationRules.userName
    },
    {
      name: "email",
      label: "이메일",
      type: "email",
      rules: validationRules.email
    },
    {
      name: "phone",
      label: "전화번호",
      type: "tel",
      rules: validationRules.phone
    }
  ];

  const passwordFields = [
    {
      name: "pwd",
      label: "새 비밀번호",
      rules: validationRules.optionalPwd
    },
    {
      name: "pwdCheck",
      label: "새 비밀번호 확인",
      rules: {
        validate: (value) => {
          if (!watchPassword && !value) return true;
          if (value !== watchPassword) {
            setFocus("pwdCheck");
            return "비밀번호가 일치하지 않습니다.";
          }
          return true;
        }
      }
    }
  ];

  return (
    <form className="admin-edit--form" onSubmit={handleSubmit(onFormSubmit)}>
      {inputFields.map((field) => (
        <InputField
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          register={register}
          rules={field.rules}
          error={errors[field.name]}
          value={adminData[field.name]}
          className="m"
        />
      ))}
      {passwordFields.map((field) => (
        <PasswordField
          key={field.name}
          label={field.label}
          name={field.name}
          register={register}
          rules={field.rules}
          error={errors[field.name]?.message}
          className="m"
        />
      ))}
      {isSuperAdmin && (
        <RolesCheckboxGroup
          roles={availableRoles}
          userRoles={adminData.roles}
          setAdminData={setAdminData}
          disabled={false}
        />
      )}
      <div className="btn-container">
        <button type="submit" className="btn">
          저장
        </button>
      </div>
    </form>
  );
};

export default AdminEditForm;
