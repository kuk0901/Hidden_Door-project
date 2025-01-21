import Button from "@components/common/buttons/Button";

// FIXME: class 추가, scss 코드 작성
const InfoEditForm = ({
  labelVal,
  currentTitle,
  onUpdate,
  onCancel,
  onRef,
  area
}) => {
  const resizeTextarea = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <article className="edit-form">
      <div className="input-section">
        {area ? (
          <>
            <div className="label-container">
              <label htmlFor="title">{labelVal}</label>
            </div>
            <div className="textarea-container textarea-container--edit">
              <textarea
                onChange={resizeTextarea}
                id="title"
                name="title"
                ref={onRef}
                defaultValue={currentTitle}
                className="textarea--edit"
                style={{
                  minHeight: "150px",
                  maxHeight: "170px"
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="label-container">
              <label htmlFor="title">{labelVal}</label>
            </div>
            <div className="input-container input-container--edit">
              <input
                id="title"
                name="title"
                ref={onRef}
                defaultValue={currentTitle}
                className="input--edit"
              />
            </div>
          </>
        )}
      </div>
      <div className="btn-container">
        <Button text="수정" onClick={onUpdate} />
        <Button text="취소" onClick={onCancel} />
      </div>
    </article>
  );
};

export default InfoEditForm;
