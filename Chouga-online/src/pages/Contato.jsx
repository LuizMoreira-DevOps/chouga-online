import Layout from "../components/Layout";
import "../css/contato.css";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

function Contato() {
  return (
    <Layout>
      <main className="contato-page page-bg">
        <section className="contato-section page-section">
          <div className="contato-content page-container">
            <aside className="contato-info">
              <h1>
                <span>FALA</span>
                <span>COM A</span>
                <span>GENTE</span>
              </h1>

              <p>
                Dúvidas, parcerias, ideias ou só chegar junto?
                Cola com nóis.
              </p>

              <ul className="contato-list">
                <li>
                  <FaEnvelope />
                  <span>chouga@email.com.br</span>
                </li>

                <li>
                  <FaPhoneAlt />
                  <span>(041) 9 9999-9999</span>
                </li>

                <li>
                  <FaMapMarkerAlt />
                  <span>Curitiba - PR / Brasil</span>
                </li>
              </ul>

              <div className="contato-social">
                <a href="/" aria-label="Facebook">
                  <FaFacebookF />
                </a>

                <a href="/" aria-label="Instagram">
                  <FaInstagram />
                </a>

                <a href="/" aria-label="YouTube">
                  <FaYoutube />
                </a>
              </div>
            </aside>

            <form className="contato-form">
              <label>
                <span>Nome</span>
                <input type="text" name="nome" />
              </label>

              <label>
                <span>E-mail</span>
                <input type="email" name="email" />
              </label>

              <label>
                <span>Assunto</span>
                <input type="text" name="assunto" />
              </label>

              <label>
                <span>Mensagem</span>
                <textarea name="mensagem" rows="5" />
              </label>

              <button type="submit">Enviar mensagem</button>
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Contato;