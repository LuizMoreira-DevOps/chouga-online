import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaEnvelope, FaLock, FaUsers } from "react-icons/fa";
import { GiHoodie, GiTShirt } from "react-icons/gi";

import skateImg from "../assets/images/assets_homeDeck/skate.png";

const menuItems = [
  {
    id: "camisetas",
    label: "CAMISETAS",
    icon: <GiTShirt />,
    path: "/camisetas",
    className: "stick-camisetas",
  },
  {
    id: "blusas",
    label: "BLUSAS",
    icon: <GiHoodie />,
    path: "/blusas",
    className: "stick-blusas",
  },
  {
    id: "sobre",
    label: "SOBRE",
    icon: <FaUsers />,
    path: "/sobre",
    className: "stick-sobre",
  },
  {
    id: "contato",
    label: "CONTATO",
    icon: <FaEnvelope />,
    path: "/contato",
    className: "stick-contato",
  },
  {
    id: "em-breve",
    label: "EM BREVE",
    icon: <FaLock />,
    path: "/em-breve",
    className: "stick-breve",
  },
];

function DeckMenu() {
  const [closing, setClosing] = useState(false);
  const [activeItem, setActiveItem] = useState("camisetas");

  const navigate = useNavigate();

  function handleClick(item) {
    if (closing) {
      return;
    }

    setActiveItem(item.id);
    setClosing(true);

    window.setTimeout(() => {
      navigate(item.path);
    }, 900);
  }

  return (
    <div
      className={`deck-menu ${closing ? "closing" : ""}`}
      aria-label="Menu principal Chouga"
    >
      <div className="deck-skate">
        <img
          className="deck-skate-image"
          src={skateImg}
          alt=""
          aria-hidden="true"
        />

        <div className="deck-stamp" aria-hidden="true">
          <strong>CH★UGA</strong>
          <span>Skateboard</span>
        </div>

        <nav className="deck-stick-menu" aria-label="Navegação principal">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`deck-stick ${item.className} ${
                  isActive ? "is-active" : ""
                }`}
                aria-label={`Abrir ${item.label}`}
                onMouseEnter={() => setActiveItem(item.id)}
                onFocus={() => setActiveItem(item.id)}
                onClick={() => handleClick(item)}
              >
                <span className="deck-stick-icon" aria-hidden="true">
                  {item.icon}
                </span>

                <span className="deck-stick-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <p className="deck-menu-hint">Selecione uma sessão</p>
    </div>
  );
}

export default DeckMenu;