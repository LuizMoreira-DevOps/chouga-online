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

            <p>O endereço acessado não foi encontrado ou pode ter mudado.</p>

            <div className="not-found-actions">
              <Link className="action not-found-link" to="/">
                Voltar para o início
              </Link>

              <Link
                className="action action-secondary not-found-link not-found-link-secondary"
                to="/produtos"
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
