const TextareaField = ({
  register,
  name,
  placeholder,
  error,
  className,
  rows = 3 // 기본 행 수 설정
}) => {
  if (register) {
    return (
      <div className={`textarea-container textarea-container__${className}`}>
        <textarea
          {...register(name, { required: true })}
          placeholder={placeholder}
          rows={rows}
          className={`textarea__${className}`}
        />
        {error && <p>{error}</p>}
      </div>
    );
  } else {
    return (
      <div className={`textarea-container textarea-container__${className}`}>
        <textarea
          placeholder={placeholder}
          rows={rows}
          className={`textarea__${className}`}
          name={name}
        />
        {error && <p>{error}</p>}
      </div>
    );
  }
};

export default TextareaField;
