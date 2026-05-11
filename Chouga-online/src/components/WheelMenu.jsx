import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaTshirt,
  FaShoePrints,
  FaVideo,
  FaEnvelope,
  FaUsers,
  FaCircle,
  FaSquare,
  FaPlay,
} from "react-icons/fa";

import wheelImg from "../assets/images/wheel.png";

function WheelMenu() {
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  const items = [
    { label: "CAMISETA", icon: <FaTshirt />, path: "/camisetas", className: "top" },
    { label: "MOLETOM", icon: <FaSquare />, path: "/shapes", className: "top-right" },
    { label: "SHAPE", icon: <FaCircle />, path: "/shapes", className: "right" },
    { label: "TÊNIS", icon: <FaShoePrints />, path: "/camisetas", className: "bottom-right" },
    { label: "ACESSÓRIOS", icon: <FaPlay />, path: "/camisetas", className: "bottom" },
    { label: "VÍDEOS", icon: <FaVideo />, path: "/sobre", className: "bottom-left" },
    { label: "SOBRE", icon: <FaUsers />, path: "/sobre", className: "left" },
    { label: "CONTATO", icon: <FaEnvelope />, path: "/contato", className: "top-left" },
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
      <span className="menu-line line-top-right"></span>
      <span className="menu-line line-right"></span>
      <span className="menu-line line-bottom-right"></span>
      <span className="menu-line line-bottom"></span>
      <span className="menu-line line-bottom-left"></span>
      <span className="menu-line line-left"></span>
      <span className="menu-line line-top-left"></span>

      <div className="wheel-center">
        <img src={wheelImg} alt="Wheel Chouga Skateboard" />
      </div>

      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`wheel-item ${item.className}`}
          onClick={() => handleClick(item.path)}
        >
          <span className="wheel-icon">{item.icon}</span>
          <span className="wheel-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export default WheelMenu;