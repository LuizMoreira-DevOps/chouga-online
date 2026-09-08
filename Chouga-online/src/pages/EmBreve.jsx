import Layout from "../components/Layout";

import PageShell from "../components/PageShell";

import "../css/embreve.css";

function EmBreve() {
  return (
    <Layout>
      <PageShell className="coming-page">
        <section className="coming-soon page-section">
          <div className="coming-soon-content page-container">
            <span className="coming-tag">CHOUGA SKATEBOARD</span>

            <h1>
              Drop
              <span>em breve</span>
            </h1>

            <p className="coming-lead">Estamos preparando algo pesado.</p>

            <p className="coming-text">
              Novos produtos estão entrando no corre. Fica por perto.
            </p>

            <div className="coming-warning">
              <span>Área em construção</span>
            </div>
          </div>
        </section>
      </PageShell>
    </Layout>
  );
}

export default EmBreve;
