import { useState } from "react";
import { useNavigate } from "react-router-dom";
import wheelImg from "../assets/images/wheel.png";

function WheelMenu() {
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  const items = [
    { label: "CAMISETAS", path: "/camisetas", className: "top" },
    { label: "SHAPES", path: "/shapes", className: "right" },
    { label: "SOBRE", path: "/sobre", className: "bottom" },
    { label: "CONTATO", path: "/contato", className: "left" },
  ];

  function handleClick(path) {
    setClosing(true);

    setTimeout(() => {
      navigate(path);
    }, 900);
  }

  return (
    <div className={`wheel-menu ${closing ? "closing" : ""}`}>
      <span className="menu-line line-top"></span>
      <span className="menu-line line-right"></span>
      <span className="menu-line line-bottom"></span>
      <span className="menu-line line-left"></span>

      <div className="wheel-center">
        <img src={wheelImg} alt="Roda Chouga Skateboard" />
      </div>

      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`wheel-item ${item.className}`}
          onClick={() => handleClick(item.path)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default WheelMenu;