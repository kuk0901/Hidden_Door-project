// CheckboxGroup.jsx
const CheckboxGroup = ({
  title,
  items,
  onChange,
  error,
  required = true,
  name
}) => (
  <div className={`${name}-section`}>
    <div className="label-container">
      <label htmlFor={name}>
        {required && <span className="text--red">*</span>}
        {title}
      </label>
    </div>
    <div className="input-container">
      {items.map((item) => (
        <div key={item.id} className="input--checkbox">
          <input
            type="checkbox"
            id={`${name}-${item.id}`}
            name={name}
            value={item.name}
            checked={item.checked}
            onChange={() => onChange(item.id)}
          />
          <label htmlFor={`${name}-${item.id}`}>{item.name}</label>
        </div>
      ))}
    </div>
    {error && <span className="text--red">{error}</span>}
  </div>
);

export default CheckboxGroup;
