import Layout from "../components/Layout";
import WheelMenu from "../components/WheelMenu";

import "../css/home.css";

function Home() {
  return (
    <Layout>
      <main className="home page-bg">
        <section className="home-section page-section">
          {/* TEXTO ESQUERDA */}
          <div className="hero-left">
            <h1>NAS RUAS</h1>

            <p>
              Feito nas ruas para as ruas.
            </p>

            <span className="hero-line"></span>
          </div>

          {/* MENU CENTRAL */}
          <div className="hero-center">
            <WheelMenu />
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;