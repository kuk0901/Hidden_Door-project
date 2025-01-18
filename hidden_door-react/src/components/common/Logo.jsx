import { useNavigate } from "react-router-dom";
const Logo = () => {
  const navigate = useNavigate();

  const handleInteraction = () => {
    navigate("/");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      handleInteraction();
    }
  };

  return (
    <button
      className="logo"
      onClick={handleInteraction}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <img
        src="/logo.svg"
        alt="Hidden Door Logo"
        width="50"
        height="50"
        className="logo-img"
      />
    </button>
  );
};

export default Logo;
