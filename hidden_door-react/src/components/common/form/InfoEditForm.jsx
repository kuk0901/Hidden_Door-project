import Button from "@components/common/buttons/Button";

const InfoEditForm = ({
  labelVal,
  currentTitle,
  onUpdate,
  onCancel,
  onChange,
  onRef,
  area,
  viewButton
}) => {
  const resizeTextarea = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

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
                  onChange={(e) => {
                    resizeTextarea(e);
                    onChange(e);
                  }}
                  id="title"
                  name="title"
                  value={currentTitle}
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
                  value={currentTitle}
                  onChange={onChange}
                  className="input--edit"
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
