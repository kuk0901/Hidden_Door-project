import { useForm, Controller } from "react-hook-form";
import PasswordField from "@components/common/form/input/PasswordField";
import RolesCheckboxGroup from "@components/admin/RolesCheckboxGroup";
import { useEffect } from "react";
import { validationRules } from "@validation/validationRules";
import { formatPhoneNumber } from "@utils/format/number.js";
import InputError from "@components/error/InputError";

const AdminEditForm = ({ children, onSubmit, formId, ...props }) => {
  const { adminData, isSuperAdmin, availableRoles, btnText } = props;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setFocus
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      userName: adminData.userName || "",
      email: adminData.email || "",
      phone: adminData.phone || "",
      roles: adminData.roles || []
    }
  });

  useEffect(() => {
    if (adminData) {
      reset({
        userName: adminData.userName || "",
        email: adminData.email || "",
        phone: adminData.phone || "",
        roles: adminData.roles || []
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

  // FIXME: 컴포넌트 분리 고려
  return (
    <form
      id={formId}
      className="admin-edit--form"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      {/* 이름 필드 */}
      <div className="form-container column">
        <div className="container">
          <div className="label-container">
            <label htmlFor="userName" className="label">
              이름
            </label>
          </div>

          <div className="input-container">
            <Controller
              name="userName"
              control={control}
              rules={validationRules.userName}
              render={({ field }) => (
                <input
                  {...field}
                  id="userName"
                  type="text"
                  className={`input input__m ${errors.userName ? "error" : ""}`}
                />
              )}
            />
          </div>

          {errors.userName && errors.userName && (
            <InputError error={errors.userName.message} />
          )}
        </div>
      </div>

      {/* 이메일 필드 */}
      <div className="form-container column">
        <div className="container">
          <div className="label-container">
            <label htmlFor="email" className="label">
              이메일
            </label>
          </div>

          <div className="input-container">
            <Controller
              name="email"
              control={control}
              rules={validationRules.email}
              render={({ field }) => (
                <input
                  {...field}
                  id="email"
                  type="email"
                  className={`input input__m ${errors.email ? "error" : ""}`}
                />
              )}
            />
          </div>

          {errors.email && <InputError error={errors.email.message} />}
        </div>
      </div>

      {/* 전화번호 필드 */}
      <div className="form-container column">
        <div className="container">
          <div className="label-container">
            <label htmlFor="phone">전화번호</label>
          </div>

          <div className="input-container">
            <Controller
              name="phone"
              control={control}
              rules={validationRules.phone}
              render={({ field }) => (
                <input
                  {...field}
                  id="phone"
                  type="tel"
                  onChange={(e) => {
                    // 숫자만 입력받도록 처리 (포맷 없이)
                    field.onChange(e.target.value.replace(/[^\d]/g, ""));
                  }}
                  onBlur={(e) => {
                    // 포커스를 벗어날 때 포맷팅 적용
                    const formattedValue = formatPhoneNumber(e.target.value);
                    field.onChange(formattedValue); // React Hook Form 상태 업데이트
                  }}
                  className={`input input__m ${errors.phone ? "error" : ""}`}
                />
              )}
            />
          </div>

          {errors.phone && errors.phone && (
            <InputError error={errors.phone.message} />
          )}
        </div>
      </div>

      {/* 비밀번호 필드 */}
      <PasswordField
        label="새 비밀번호"
        name="pwd"
        register={(name, rules) => control.register(name, rules)}
        rules={validationRules.optionalPwd}
        error={errors["pwd"]?.message}
        className="m"
      />

      {/* 비밀번호 확인 필드 */}
      <PasswordField
        label="새 비밀번호 확인"
        name="pwdCheck"
        register={(name, rules) => control.register(name, rules)}
        rules={{
          validate: (value) => {
            if (!watchPassword && !value) return true;
            if (value !== watchPassword) {
              setFocus("pwdCheck");
              return "비밀번호가 일치하지 않습니다.";
            }
            return true;
          }
        }}
        error={errors["pwdCheck"]?.message}
        className="m"
      />

      {children}

      {/* 권한 체크박스 그룹 */}
      {isSuperAdmin && (
        <RolesCheckboxGroup
          roles={availableRoles} // 모든 역할
          control={control} // React Hook Form의 control 객체 전달
          name="roles" // 필드 이름
          disabled={false} // 비활성화 여부
        />
      )}

      {/* 저장 버튼 */}
      {btnText && (
        <div className="btn-container">
          <button type="submit" className="btn">
            저장
          </button>
        </div>
      )}
    </form>
  );
};

export default AdminEditForm;
