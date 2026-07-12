import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUsers,
} from "react-icons/fa";
import {
  GiHoodie,
  GiTShirt,
} from "react-icons/gi";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import homeWheels1 from "../assets/images/homeWheels-1.png";
import homeWheels2 from "../assets/images/homeWheels-2.png";
import homeWheels3 from "../assets/images/homeWheels-3.png";

const wheels = [
  homeWheels1,
  homeWheels2,
  homeWheels3,
];

const PAGE_LOAD_ID = crypto.randomUUID();

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
    id: "eventos",
    label: "EVENTOS",
    icon: <FaLock />,
    path: "/em-breve",
    className: "right",
  },
  {
    id: "atletas",
    label: "ATLETAS",
    icon: <FaLock />,
    path: "/em-breve",
    className: "bottom-right",
  },
  {
    id: "criacao-personalizacao",
    label: "CRIAÇÃO/PERSONALIZAÇÃO",
    icon: <FaLock />,
    path: "/em-breve",
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

function selectNextWheel(visitId) {
  const savedVisitId = sessionStorage.getItem(
    "chouga-home-visit",
  );

  const savedWheelIndex = Number(
    sessionStorage.getItem("chouga-wheel-index"),
  );

  /*
   * O React StrictMode pode inicializar o componente
   * duas vezes durante o desenvolvimento.
   *
   * Quando isso acontecer, mantemos a mesma wheel
   * para a mesma visita.
   */
  if (
    savedVisitId === visitId
    && Number.isInteger(savedWheelIndex)
    && savedWheelIndex >= 0
    && savedWheelIndex < wheels.length
  ) {
    return savedWheelIndex;
  }

  const currentIndex = Number.isInteger(savedWheelIndex)
    ? savedWheelIndex
    : -1;

  const nextIndex = (currentIndex + 1) % wheels.length;

  sessionStorage.setItem(
    "chouga-home-visit",
    visitId,
  );

  sessionStorage.setItem(
    "chouga-wheel-index",
    String(nextIndex),
  );

  return nextIndex;
}

function WheelMenu() {
  const [closing, setClosing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [wheelIndex] = useState(() => {
    const visitId = `${PAGE_LOAD_ID}:${location.key}`;

    return selectNextWheel(visitId);
  });

  const currentWheel = wheels[wheelIndex];

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
        <img
          src={currentWheel}
          alt={`Wheel Chouga Skateboard ${wheelIndex + 1}`}
        />
      </div>

      {menuItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`wheel-item ${item.className}`}
          onClick={() => handleClick(item.path)}
        >
          <span className="wheel-icon">
            {item.icon}
          </span>

          <span className="wheel-label">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default WheelMenu;