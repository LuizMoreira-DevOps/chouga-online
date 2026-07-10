import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUsers } from "react-icons/fa";
import { GiHoodie, GiTShirt } from "react-icons/gi";

import Layout from "../components/Layout";

import logoImg from "../assets/logo/Logo.png";

import "../css/homeDeck.css";

const deckItems = [
  {
    id: "camisetas",
    label: "Camisetas",
    path: "/camisetas",
    icon: <GiTShirt />,
    className: "deck-sticker-camisetas",
  },
  {
    id: "blusas",
    label: "Blusas",
    path: "/blusas",
    icon: <GiHoodie />,
    className: "deck-sticker-blusas",
  },
  {
    id: "sobre",
    label: "Sobre",
    path: "/sobre",
    icon: <FaUsers />,
    className: "deck-sticker-sobre",
  },
  {
    id: "contato",
    label: "Contato",
    path: "/contato",
    icon: <FaEnvelope />,
    className: "deck-sticker-contato",
  },
  {
    id: "em-breve",
    label: "Em breve",
    path: "/em-breve",
    icon: <FaLock />,
    className: "deck-sticker-breve",
  },
];

function HomeDeck() {
  return (
    <Layout hideFooter>
      <main className="deck-page page-bg">
        <section className="deck-section page-section">
          <div className="deck-hud">
            <span>Cash</span>
            <strong>$2022</strong>

            <span>Score</span>
            <strong>00000</strong>

            <span>Lines</span>
            <strong>4</strong>
          </div>

          <div className="deck-brand">
            <img src={logoImg} alt="Chouga Skateboard" />
          </div>

          <div className="deck-copy">
            <h1>
              Streetwear
              <br />
              não se veste.
              <br />
              se vive.
            </h1>
          </div>

          <div className="deck-stage" aria-label="Menu Deck Chouga">
            <div className="deck-board" aria-hidden="true">
              <span className="deck-board-grip"></span>
              <span className="deck-board-hole deck-hole-one"></span>
              <span className="deck-board-hole deck-hole-two"></span>
              <span className="deck-board-hole deck-hole-three"></span>
              <span className="deck-board-hole deck-hole-four"></span>
              <span className="deck-board-hole deck-hole-five"></span>
              <span className="deck-board-hole deck-hole-six"></span>
              <span className="deck-board-hole deck-hole-seven"></span>
              <span className="deck-board-hole deck-hole-eight"></span>
            </div>

            <nav className="deck-stickers" aria-label="Navegação principal">
              {deckItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`deck-sticker ${item.className}`}
                >
                  <span className="deck-sticker-icon" aria-hidden="true">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="deck-tape">
            <strong>Desde 2022</strong>
            <span>Rua • Skate • Família</span>
          </div>

          <p className="deck-start">Press start to session</p>
        </section>
      </main>
    </Layout>
  );
}

export default HomeDeck;