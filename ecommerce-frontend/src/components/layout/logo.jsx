import { Link } from "react-router-dom";
import "./Logo.css";

const Logo = ({ to = "/", size = "normal" }) => {
  return (
    <Link to={to} className={`logo logo--${size}`}>
      <svg
        className="logo__icon"
        viewBox="0 0 64 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 34L24 8H34L18 34H8Z"
          fill="white"
        />
        <path
          d="M27 8H45L58 21L45 34H27L39 21L27 8Z"
          fill="#D7FF3F"
        />
        <path d="M3 27H18" stroke="#D7FF3F" strokeWidth="4" strokeLinecap="round" />
        <path d="M1 34H14" stroke="#D7FF3F" strokeWidth="4" strokeLinecap="round" />
        <path d="M6 20H22" stroke="#D7FF3F" strokeWidth="4" strokeLinecap="round" />
      </svg>

      <span className="logo__text">
        Next<span>Step</span>
      </span>
    </Link>
  );
};

export default Logo;