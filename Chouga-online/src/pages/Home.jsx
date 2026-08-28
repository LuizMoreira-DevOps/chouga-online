import { useEffect } from "react";
import { Link } from "react-router-dom";

import PageShell from "../components/PageShell";

import Layout from "../components/Layout";
import WheelMenu from "../components/WheelMenu";

import "../css/home.css";

const compactLinks = [
  {
    label: "Produtos",
    path: "/produtos",
  },
  {
    label: "Sobre",
    path: "/sobre",
  },
  {
    label: "Contato",
    path: "/contato",
  },
];

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
      <PageShell className="home">
        <section className="home-section page-section">
          <div className="home-wheels-content">
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
          </div>

          <div className="home-compact" aria-label="Navegação principal">
            <div className="home-compact-brand">
              <h1>Streetwear</h1>

              <p>
                não se veste.
                <br />
                Se vive.
              </p>
            </div>

            <nav
              className="home-compact-nav"
              aria-label="Atalhos da página inicial"
            >
              {compactLinks.map((item) => (
                <Link key={item.path} to={item.path}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </PageShell>
    </Layout>
  );
}

export default Home;
