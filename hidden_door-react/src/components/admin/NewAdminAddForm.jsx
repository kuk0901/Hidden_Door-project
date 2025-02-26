import Form from "@components/common/form/Form";
import { validationRules } from "@validation/validationRules";

const NewAdminAddForm = ({ onSubmit, onCancel }) => {
  const newAdminFields = [
    {
      name: "userName",
      placeholder: "홍길동",
      className: "m",
      id: "userName",
      label: "이름",
      type: "text",
      autoFocus: true,
      validation: validationRules.userName
    },
    {
      name: "phone",
      placeholder: "- 없이 숫자만 입력해 주세요.",
      className: "m",
      id: "phone",
      label: "휴대폰",
      type: "tel",
      validation: validationRules.phone
    },
    {
      name: "email",
      placeholder: "your@email.com",
      className: "m",
      id: "email",
      label: "이메일",
      type: "email",
      validation: validationRules.email
    },
    {
      name: "pwd",
      placeholder: "대소문자 + 특수문자 + 숫자 포함 8글자 이상",
      className: "m",
      id: "pwd",
      label: "비밀번호",
      type: "password",
      validation: validationRules.password
    }
  ];

  return (
    <div className="admin--form--section">
      <h3 className="title">관리자 계정 생성</h3>

      <Form id="newAdminAddForm" onSubmit={onSubmit} fields={newAdminFields} />

      <div className="btn-container">
        <button type="submit" className="btn" form="newAdminAddForm">
          계정 생성
        </button>
        <button onClick={onCancel} className="btn">
          취소
        </button>
      </div>
    </div>
  );
};

export default NewAdminAddForm;
