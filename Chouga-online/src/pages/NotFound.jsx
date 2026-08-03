import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import "../css/notFound.css";

function NotFound() {
  return (
    <Layout>
      <main className="not-found-page page-bg">
        <section className="not-found-section page-section">
          <div className="not-found-content page-container">
            <span className="not-found-code">404</span>

            <h1>Essa pista não existe</h1>

            <p>
              O endereço acessado não foi encontrado ou pode ter
              mudado.
            </p>

            <div className="not-found-actions">
              <Link to="/" className="not-found-link">
                Voltar para o início
              </Link>

              <Link
                to="/produtos"
                className="not-found-link not-found-link-secondary"
              >
                Ver produtos
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default NotFound;
