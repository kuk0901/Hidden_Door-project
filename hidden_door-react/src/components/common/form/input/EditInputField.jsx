const EditInputField = ({
  id,
  name,
  value,
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
      onChange={onChange}
      ref={onRef}
      autoFocus={autoFocus}
      className={className || "input--edit"}
    />
  </div>
);

export default EditInputField;
