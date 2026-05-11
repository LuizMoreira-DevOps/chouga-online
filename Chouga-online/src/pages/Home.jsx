import Layout from "../components/Layout";
import WheelMenu from "../components/WheelMenu";

import "../css/home.css";

function Home() {
  return (
    <Layout>
      <section className="home">

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
    </Layout>
  );
}

export default Home;