import InputError from "@components/error/InputError";

const TextareaField = ({
  register,
  name,
  placeholder,
  error,
  className,
  rows = 3,
  themeForm,
  id,
  label,
  value,
  onChange
}) => {
  // register와 themeForm이 동시에 있는 경우
  if (register && themeForm) {
    return (
      <div className="form-container column">
        <div className="container">
          <div className={`label-container text-center`}>
            <label htmlFor={id}>
              <span className="text--red">*</span>
              {label}
            </label>
          </div>
          <div
            className={`textarea-container textarea-container__${className}`}
          >
            <textarea
              id={id}
              {...register(name, { required: true })}
              placeholder={placeholder}
              rows={rows}
              className={`textarea__${className}`}
              required
            />
          </div>
        </div>

        {error && <InputError error={error} />}
      </div>
    );
  }

  if (register) {
    return (
      <div className={`textarea-container textarea-container__${className}`}>
        <textarea
          {...register(name, { required: true })}
          placeholder={placeholder}
          rows={rows}
          className={`textarea__${className}`}
        />
        {error && <p className="text--red">{error}</p>}
      </div>
    );
  }

  if (themeForm) {
    return (
      <>
        <div className="label-container">
          <label htmlFor={id}>
            <span className="text--red">*</span>
            {label}
          </label>
        </div>
        <div className={`textarea-container textarea-container__${className}`}>
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            rows={rows}
            className={`textarea__${className}`}
            value={value}
            onChange={onChange}
            required
          />
          {error && <p className="text--red">{error}</p>}
        </div>
      </>
    );
  }

  return (
    <div className={`textarea-container textarea-container__${className}`}>
      <textarea
        placeholder={placeholder}
        rows={rows}
        className={`textarea__${className}`}
        name={name}
      />
      {error && <p className="text--red">{error}</p>}
    </div>
  );
};

export default TextareaField;
