import Button from "@components/common/buttons/Button";

const InfoEditForm = ({
  labelVal,
  currentTitle,
  onUpdate,
  onCancel,
  onChange,
  onRef,
  area,
  viewButton,
  autoFocus
}) => {
  const resizeTextarea = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const onFocus = (e) => {
    const element = e.target;
    element.selectionStart = element.value.length;
  };

  const autoFocusProps = autoFocus ? { autoFocus: true } : {};

  if (onRef) {
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
                  required
                  onChange={resizeTextarea}
                  onFocus={onFocus}
                  id="title"
                  name="title"
                  ref={onRef}
                  defaultValue={currentTitle}
                  className="textarea--edit"
                  style={{
                    minHeight: "150px",
                    maxHeight: "170px"
                  }}
                  {...autoFocusProps}
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
                  required
                  id="title"
                  name="title"
                  ref={onRef}
                  defaultValue={currentTitle}
                  className="input--edit"
                  {...autoFocusProps}
                />
              </div>
            </>
          )}
        </div>
        {viewButton && (
          <div className="btn-container">
            <Button text="수정" className="btn" onClick={onUpdate} />
            <Button text="취소" className="btn" onClick={onCancel} />
          </div>
        )}
      </article>
    );
  } else if (onChange) {
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
                  required
                  onChange={(e) => {
                    resizeTextarea(e);
                    onChange(e);
                  }}
                  onFocus={onFocus}
                  id="title"
                  name="title"
                  value={currentTitle}
                  className="textarea--edit"
                  style={{
                    minHeight: "150px",
                    maxHeight: "170px"
                  }}
                  {...autoFocusProps}
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
                  required
                  id="title"
                  name="title"
                  value={currentTitle}
                  onChange={onChange}
                  className="input--edit"
                  {...autoFocusProps}
                />
              </div>
            </>
          )}
        </div>
        {viewButton && (
          <div className="btn-container">
            <Button text="수정" className="btn" onClick={onUpdate} />
            <Button text="취소" className="btn" onClick={onCancel} />
          </div>
        )}
      </article>
    );
  } else {
    return null;
  }
};

export default InfoEditForm;
