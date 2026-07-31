import { useState } from "react";

import { FaEnvelope, FaLock, FaShoppingBag, FaUsers } from "react-icons/fa";

import { FaShirt } from "react-icons/fa6";

import { IoShirtSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

import homeWheels1Small from "../assets/images/optimized/homeWheels-1-640.webp";
import homeWheels1Large from "../assets/images/optimized/homeWheels-1-960.webp";
import homeWheels2Small from "../assets/images/optimized/homeWheels-2-640.webp";
import homeWheels2Large from "../assets/images/optimized/homeWheels-2-960.webp";
import homeWheels3Small from "../assets/images/optimized/homeWheels-3-640.webp";
import homeWheels3Large from "../assets/images/optimized/homeWheels-3-960.webp";

const wheels = [
  {
    src: homeWheels1Small,
    srcSet: `${homeWheels1Small} 640w, ${homeWheels1Large} 960w`,
    alt: "Wheel Chouga Skateboard 1",
  },
  {
    src: homeWheels2Small,
    srcSet: `${homeWheels2Small} 640w, ${homeWheels2Large} 960w`,
    alt: "Wheel Chouga Skateboard 2",
  },
  {
    src: homeWheels3Small,
    srcSet: `${homeWheels3Small} 640w, ${homeWheels3Large} 960w`,
    alt: "Wheel Chouga Skateboard 3",
  },
];

const PAGE_LOAD_ID = crypto.randomUUID();

const menuItems = [
  {
    id: "produtos",
    label: "PRODUTOS",
    icon: <FaShirt />,
    path: "/produtos",
    className: "top",
  },
  {
    id: "eventos",
    label: "EVENTOS",
    icon: <FaLock />,
    path: "/em-breve",
    className: "top-right",
  },
  {
    id: "atletas",
    label: "ATLETAS",
    icon: <FaLock />,
    path: "/em-breve",
    className: "right",
  },
  {
    id: "personalizacao",
    label: "PERSONALIZAÇÃO",
    icon: <FaLock />,
    path: "/em-breve",
    className: "bottom-right",
  },
  {
    id: "breve-1",
    label: "EM BREVE",
    icon: <FaLock />,
    path: "/em-breve",
    className: "bottom",
  },
  {
    id: "breve-2",
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
  const savedVisitId = sessionStorage.getItem("chouga-home-visit");

  const savedWheelIndex = Number(sessionStorage.getItem("chouga-wheel-index"));

  /*
   * O React StrictMode pode inicializar o componente
   * duas vezes durante o desenvolvimento.
   *
   * Quando isso acontecer, mantemos a mesma wheel
   * para a mesma visita.
   */
  if (
    savedVisitId === visitId &&
    Number.isInteger(savedWheelIndex) &&
    savedWheelIndex >= 0 &&
    savedWheelIndex < wheels.length
  ) {
    return savedWheelIndex;
  }

  const currentIndex = Number.isInteger(savedWheelIndex) ? savedWheelIndex : -1;

  const nextIndex = (currentIndex + 1) % wheels.length;

  sessionStorage.setItem("chouga-home-visit", visitId);

  sessionStorage.setItem("chouga-wheel-index", String(nextIndex));

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
          src={currentWheel.src}
          srcSet={currentWheel.srcSet}
          sizes="(max-width: 480px) 315px, 520px"
          alt={currentWheel.alt}
          width="960"
          height="972"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
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
