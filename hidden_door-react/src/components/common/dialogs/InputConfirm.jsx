import { useRecoilState } from "recoil";
import { inputConfirmState } from "../../../atoms/inputConfirmAtom";

const InputConfirm = () => {
  const [{ isOpen, message, password, onConfirm, onCancel }, setConfirmState] =
    useRecoilState(inputConfirmState);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.(password);

    setConfirmState({
      isOpen: false,
      message: "",
      password: "",
      onConfirm: null,
      onCancel: null
    });
  };

  const handleCancel = () => {
    onCancel?.();

    setConfirmState({
      isOpen: false,
      message: "",
      password: "",
      onConfirm: null,
      onCancel: null
    });
  };

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <p className="confirm-modal__msg confirm-modal__input-msg">{message}</p>
        <input
          type="password"
          className="confirm-modal__input"
          value={password}
          onChange={(e) =>
            setConfirmState((prev) => ({
              ...prev,
              password: e.target.value
            }))
          }
          placeholder="비밀번호를 입력하세요"
          pattern="[0-9]*"
          inputMode="numeric"
        />

        <div className="confirm-modal__btn-container">
          <button
            onClick={handleCancel}
            className="confirm-modal__btn confirm-modal__btn--cancel btn"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="confirm-modal__btn confirm-modal__btn--confirm btn"
            disabled={!password}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputConfirm;
