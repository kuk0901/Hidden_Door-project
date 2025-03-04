import Button from "@components/common/buttons/Button";

const ButtonGroup = ({ onUpdate, onCancel }) => (
  <div className="btn-container">
    <Button text="수정" className="btn" onClick={onUpdate} />
    <Button text="취소" className="btn" onClick={onCancel} />
  </div>
);

export default ButtonGroup;
