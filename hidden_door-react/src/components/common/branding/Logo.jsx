import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <button
      className="logo"
      onClick={() => navigate("/")}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/")}
      tabIndex={0}
    >
      <span className="logo-img" aria-hidden="true"></span>
    </button>
  );
};

export default Logo;
