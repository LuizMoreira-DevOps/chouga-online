import { useEffect } from "react";

import Layout from "../components/Layout";
import WheelMenu from "../components/WheelMenu";

import "../css/home.css";
import "../css/embreve.css";

function Home() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  return (
    <Layout>
      <main className="home page-bg">
        <section className="home-section page-section">
          <div className="hero-left">
            <h1>Streetwear</h1>

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
