import Layout from "../components/Layout";

import "../css/sobre.css";

import sobre1 from "../assets/images/sobre-1.jpeg";
import sobre2 from "../assets/images/optimized/sobre/sobre-2.webp";
import sobre3 from "../assets/images/optimized/sobre/sobre-3.webp";
import sobre4 from "../assets/images/optimized/sobre/sobre-4.webp";
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
                <img
                  src={sobre2}
                  alt="Skatista saltando sobre pista urbana"
                  loading="eager"
                  fetchPriority="high"
                  width={1297}
                  height={1212}
                />
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
                    loading="lazy"
                    decoding="async"
                    width={578}
                    height={952}
                  />
                </figure>

                <figure className="sobre-photo sobre-photo-memory sobre-photo-memory-two">
                  <img
                    src={sobre3}
                    alt="Skatistas na pista Chouga"
                    loading="lazy"
                    decoding="async"
                    width={1268}
                    height={1241}
                  />
                </figure>

                <figure className="sobre-photo sobre-photo-memory sobre-photo-memory-three">
                  <img
                    src={sobre4}
                    alt="Registro da história Chouga Skateboard"
                    loading="lazy"
                    decoding="async"
                    width={720}
                    height={481}
                  />
                </figure>

                <figure className="sobre-photo sobre-photo-memory sobre-photo-memory-four">
                  <img
                    src={sobre5}
                    alt="Registro urbano da Chouga Skateboard"
                    loading="lazy"
                    decoding="async"
                    width={960}
                    height={1280}
                  />
                </figure>
              </div>
            </section>

            <ul className="sobre-pill-list" aria-label="Pilares da marca">
              <li>Skate</li>
              <li>Rua</li>
              <li>Liberdade</li>
              <li>Família</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Sobre;
