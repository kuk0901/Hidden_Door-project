import { useCallback } from "react";

const EditTextareaField = ({
  id,
  name,
  value,
  defaultValue,
  onChange,
  onRef,
  autoFocus,
  className
}) => {
  const resizeTextarea = useCallback((e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }, []);

  const onFocus = useCallback((e) => {
    const element = e.target;
    element.selectionStart = element.value.length;
  }, []);

  return (
    <div className="textarea-container textarea-container--edit">
      <textarea
        required
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          resizeTextarea(e);
          if (onChange) onChange(e);
        }}
        onFocus={onFocus}
        ref={onRef}
        autoFocus={autoFocus}
        className={className || "textarea--edit"}
        style={{
          minHeight: "150px",
          maxHeight: "170px"
        }}
      />
    </div>
  );
};

export default EditTextareaField;
