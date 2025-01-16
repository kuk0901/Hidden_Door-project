const SubmitButton = ({ text }) => {
  return (
    <div className="btn-container">
      <button className="btn tertiary" type="submit">
        {text}
      </button>
    </div>
  );
};

export default SubmitButton;
