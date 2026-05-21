import Layout from "../components/Layout";
import "../css/contato.css";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

function Contato() {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const nome = formData.get("nome");
    const email = formData.get("email");
    const assunto = formData.get("assunto");
    const mensagem = formData.get("mensagem");

    const texto = `Olá, Chouga! Meu nome é ${nome}.

E-mail: ${email}
Assunto: ${assunto}

Mensagem:
${mensagem}`;

    const whatsappUrl = `https://wa.me/5541997485063?text=${encodeURIComponent(
      texto,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

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
                  <FaEnvelope aria-hidden="true" />
                  <span>chougaskateboard@gmail.com</span>
                </li>

                <li>
                  <FaPhoneAlt aria-hidden="true" />
                  <span>(41) 99748-5063</span>
                </li>

                <li>
                  <FaMapMarkerAlt aria-hidden="true" />
                  <span>Curitiba - PR / Brasil</span>
                </li>
              </ul>

              <div className="contato-social">
                <a
                  href="https://instagram.com/chougaskateboard_/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram da Chouga Skateboard"
                >
                  <FaInstagram aria-hidden="true" />
                </a>

                <a
                  href="https://wa.me/5541997485063"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp da Chouga Skateboard"
                >
                  <FaWhatsapp aria-hidden="true" />
                </a>
              </div>
            </aside>

            <form className="contato-form" onSubmit={handleSubmit}>
              <label>
                <span>Nome</span>
                <input type="text" name="nome" required />
              </label>

              <label>
                <span>E-mail</span>
                <input type="email" name="email" required />
              </label>

              <label>
                <span>Assunto</span>
                <input type="text" name="assunto" required />
              </label>

              <label>
                <span>Mensagem</span>
                <textarea name="mensagem" rows="5" required />
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