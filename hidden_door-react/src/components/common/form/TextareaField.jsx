const TextareaField = ({
  register,
  name,
  placeholder,
  error,
  className,
  rows = 3 // 기본 행 수 설정
}) => {
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
};

export default TextareaField;
