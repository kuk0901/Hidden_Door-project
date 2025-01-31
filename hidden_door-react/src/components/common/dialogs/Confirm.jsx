import { useRecoilState } from "recoil";
import { confirmState } from "@atoms/confirmAtom";

const Confirm = () => {
  const [{ isOpen, message, onConfirm, onCancel }, setConfirmState] =
    useRecoilState(confirmState);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();

    setConfirmState({
      isOpen: false,
      message: "",
      onConfirm: null,
      onCancel: null
    });
  };

  const handleCancel = () => {
    onCancel?.();

    setConfirmState({
      isOpen: false,
      message: "",
      onConfirm: null,
      onCancel: null
    });
  };

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <p className="confirm-modal__msg">{message}</p>

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
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
