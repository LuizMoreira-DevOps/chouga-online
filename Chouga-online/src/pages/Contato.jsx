import "../css/contato.css";

import Navbar from "../components/Header";

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
    <main className="contato-page">
      <Navbar />

      <section className="contato-hero">
        <div className="contato-content">
          <aside className="contato-info">
            <h1>
              <span>FALA</span>
              <span>COM A</span>
              <span>GENTE</span>
            </h1>

            <p>
              Dúvidas, parcerias, ideias ou só chegar junto?
              <p>Cola com nóis.</p>
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
  );
}

export default Contato;