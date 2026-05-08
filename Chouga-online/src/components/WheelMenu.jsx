import { useState } from "react";
import { useNavigate } from "react-router-dom";

function WheelMenu() {
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "CAMISETAS", path: "/camisetas", className: "item-top" },
    { label: "SHAPES", path: "/shapes", className: "item-right" },
    { label: "SOBRE", path: "/sobre", className: "item-bottom" },
    { label: "CONTATO", path: "/contato", className: "item-left" },
  ];

  function handleClick(path) {
    setClosing(true);

    setTimeout(() => {
      navigate(path);
    }, 800);
  }

  return (
    <div className={`wheel-menu ${closing ? "closing" : ""}`}>
      <div className="wheel-center">●</div>

      {menuItems.map((item) => (
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