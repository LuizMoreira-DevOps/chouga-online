import Layout from "../components/Layout";
import "../css/sobre.css";

import sobre1 from "../assets/images/sobre-1.jpeg";
import sobre2 from "../assets/images/sobre-2.jpeg";
import sobre3 from "../assets/images/sobre-3.jpeg";
import sobre4 from "../assets/images/sobre-4.jpeg";
import sobre5 from "../assets/images/sobre-5.jpeg";

function Sobre() {
  return (
    <Layout>
      <main className="sobre-page page-bg">
        <section className="sobre-section page-section">
          <div className="sobre-container page-container">
            <header className="sobre-hero">
              <div className="sobre-copy">
                <span className="sobre-tag">Since 2022</span>

                <h1 className="sobre-title">
                  Sobre
                  <br />
                  <strong>nós</strong>
                </h1>

                <p className="sobre-kicker">Antes de ser marca, foi sessão.</p>

                <h2 className="sobre-callout">
                  Nascida no concreto.
                  <br />
                  Criada entre amigos.
                  <br />
                  Feita pra rua.
                </h2>
              </div>

              <figure className="sobre-photo sobre-photo-main">
                <img src={sobre2} alt="Skatista saltando sobre pista urbana" />
              </figure>
            </header>

            <section className="sobre-story" aria-label="História da Chouga">
              <article className="sobre-text-card">
                <p>
                  A Chouga Skateboard nasceu em 2022, da união de amigos
                  apaixonados pelo skate, pela cultura de rua e pelo espírito de
                  liberdade que o skate representa.
                </p>

                <p>
                  Tudo começou nas sessões entre amigos, compartilhando
                  manobras, histórias, risadas e a vontade de criar algo que
                  representasse a verdadeira essência do rolê.
                </p>

                <p>
                  Mais do que uma marca, a Chouga é uma família construída sobre
                  amizade, respeito e dedicação ao skate. Cada estampa, cada
                  produto e cada projeto carregam a energia das pistas, das ruas
                  e da comunidade que faz o skate acontecer todos os dias.
                </p>
              </article>

              <div className="sobre-memory-wall">
                <figure className="sobre-photo sobre-photo-memory sobre-photo-memory-one">
                  <img
                    src={sobre1}
                    alt="Skatista Chouga em manobra na pista"
                  />
                </figure>

                <figure className="sobre-photo sobre-photo-memory sobre-photo-memory-two">
                  <img src={sobre3} alt="Skatistas na pista Chouga" />
                </figure>

                <figure className="sobre-photo sobre-photo-memory sobre-photo-memory-three">
                  <img src={sobre4} alt="Registro da história Chouga Skateboard" />
                </figure>

                <figure className="sobre-photo sobre-photo-memory sobre-photo-memory-four">
                  <img src={sobre5} alt="Registro urbano da Chouga Skateboard" />
                </figure>
              </div>
            </section>

            <div className="sobre-pill-list" aria-label="Pilares da marca">
              <span>Skate</span>
              <span>Rua</span>
              <span>Liberdade</span>
              <span>Família</span>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Sobre;