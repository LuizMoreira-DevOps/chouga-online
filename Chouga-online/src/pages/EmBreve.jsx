import Layout from "../components/Layout";
import "../css/embreve.css";

function EmBreve() {
  return (
    <Layout>
      <main className="coming-page page-bg">
        <section className="coming-soon page-section">
          <div className="coming-soon-content page-container">
            <span className="coming-tag">
              CHOUGA SKATEBOARD
            </span>

            <h1>
              Drop
              <span>em breve</span>
            </h1>

            <p className="coming-lead">
              Estamos preparando algo pesado.
            </p>

            <p className="coming-text">
              Novos produtos estão entrando no corre.
              Fica por perto.
            </p>

            <div className="coming-warning">
              <span>Área em construção</span>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default EmBreve;