const EditInputField = ({
  id,
  name,
  value,
  defaultValue,
  onChange,
  onRef,
  autoFocus,
  className
}) => (
  <div className="input-container input-container--edit">
    <input
      required
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      ref={onRef}
      autoFocus={autoFocus}
      className={className || "input--edit"}
    />
  </div>
);

export default EditInputField;
