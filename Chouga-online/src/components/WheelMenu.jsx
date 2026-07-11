import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaUsers,
  FaLock,
} from "react-icons/fa";

import { 
  GiHoodie, 
  GiTShirt,
} from "react-icons/gi";

import wheelImg from "../assets/images/wheel.png";

const menuItems = [
  {
    id: "camisetas",
    label: "CAMISETA",
    icon: <GiTShirt />,
    path: "/camisetas",
    className: "top",
  },
  {
    id: "blusas",
    label: "BLUSAS",
    icon: <GiHoodie />,
    path: "/blusas",
    className: "top-right",
  },
  {
    id: "breve-2",
    label: "EVENTOS",
    icon: <FaLock />,
    path: "/eventos",
    className: "right",
  },
  {
    id: "breve-3",
    label: "ATLETAS",
    icon: <FaLock />,
    path: "/atletas",
    className: "bottom-right",
  },
  {
    id: "breve-4",
    label: "CRIAÇÃO/PERSONALIZAÇÃO",
    icon: <FaLock />,
    path: "/criacao-personalizacao",
    className: "bottom",
  },
  {
    id: "breve-5",
    label: "EM BREVE",
    icon: <FaLock />,
    path: "/em-breve",
    className: "bottom-left",
  },
  {
    id: "sobre",
    label: "SOBRE",
    icon: <FaUsers />,
    path: "/sobre",
    className: "left",
  },
  {
    id: "contato",
    label: "CONTATO",
    icon: <FaEnvelope />,
    path: "/contato",
    className: "top-left",
  },
];

function WheelMenu() {
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  function handleClick(path) {
    if (closing) {
      return;
    }

    setClosing(true);

    setTimeout(() => {
      navigate(path);
    }, 900);
  }

  return (
    <div className={`wheel-menu ${closing ? "closing" : ""}`}>
      <div className="wheel-center">
        <img src={wheelImg} alt="Wheel Chouga Skateboard" />
      </div>

      {menuItems.map((item) => (
        <button
          key={item.id}
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