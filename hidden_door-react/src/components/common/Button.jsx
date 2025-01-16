const Button = ({ text, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return <button onClick={handleClick}>{text}</button>;
};

export default Button;
