const Button = ({ text, onClick, className }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <button onClick={handleClick} className={className || ""}>
      {text}
    </button>
  );
};

export default Button;
