import { useEffect, useRef } from "react";

const ReservationCheckModal = ({
  isOpen,
  handleCloseModal,
  checkReservationNumber,
  setCheckReservationNumber,
  checkName,
  setCheckName,
  onCheck
}) => {
  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  const onClose = () => {
    handleCloseModal();
    setCheckReservationNumber("");
    setCheckName("");
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      dialog.showModal();
      firstInputRef.current?.focus();
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      dialog.close();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;

    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    dialog.addEventListener("keydown", handleTabKey);
    return () => dialog.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="reservation-check-modal"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <h2 className="modal-content-header">예약 확인</h2>
        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-container">
            <label htmlFor="reservationNumber">예약 번호:</label>
            <input
              ref={firstInputRef}
              id="reservationNumber"
              type="text"
              placeholder="123456789"
              value={checkReservationNumber}
              onChange={(e) => setCheckReservationNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="name">이름:</label>
            <input
              id="name"
              type="text"
              placeholder="홍길동"
              value={checkName}
              onChange={(e) => setCheckName(e.target.value)}
              required
            />
          </div>
          <div className="btn-container">
            <button
              type="button"
              onClick={onCheck}
              disabled={!checkReservationNumber || !checkName}
              className="btn"
            >
              확인
            </button>
            <button type="button" onClick={onClose} className="btn delete">
              닫기
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ReservationCheckModal;
