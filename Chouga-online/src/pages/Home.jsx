import Layout from "../components/Layout";
import WheelMenu from "../components/WheelMenu";

import "../css/home.css";
import "../css/embreve.css";

function Home() {
  return (
    <Layout hideFooter>
      <main className="home page-bg">
        <section className="home-section page-section">
          <div className="hero-left">
            <h1>
              Streetwear
            </h1>
            <p>
              não se veste.
              <br />
              Se vive.
            </p>
          </div>

          <div className="hero-center">
            <WheelMenu />
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;