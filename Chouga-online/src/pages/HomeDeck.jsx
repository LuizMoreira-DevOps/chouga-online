import Layout from "../components/Layout";
import DeckMenu from "../components/DeckMenu";

import "../css/homeDeck.css";

function HomeDeck() {
  return (
    <Layout hideFooter>
      <main className="deck-home page-bg">
        <section className="deck-home-section">
          <div className="deck-hero-copy">
            <h1>Streetwear</h1>

            <p>
              não se veste.
              <br />
              Se vive.
            </p>
          </div>

          <div className="deck-hud" aria-label="Status da sessão">
            <span>Cash</span>
            <strong>$2022</strong>

            <span>Score</span>
            <strong>00000</strong>

            <span>Lines</span>
            <strong>4</strong>
          </div>

          <div className="deck-menu-area">
            <DeckMenu />
          </div>

          <aside className="deck-note">
            <span>Desde</span>
            <strong>2022</strong>
            <small>Rua • Skate • Família</small>
          </aside>
        </section>
      </main>
    </Layout>
  );
}

export default HomeDeck;