import { useState } from "react";
import Layout from "../components/Layout";
import "../css/contato.css";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import { buildWhatsAppUrl, siteContacts } from "../constants/siteContacts";

function Contato() {
  const [formStatus, setFormStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const website = formData.get("website");

    if (website) {
      return;
    }

    const nome = formData.get("nome");
    const email = formData.get("email");
    const assunto = formData.get("assunto");
    const mensagem = formData.get("mensagem");

    const texto = `Olá, Chouga! Meu nome é ${nome}.

E-mail: ${email}
Assunto: ${assunto}

Mensagem:
${mensagem}`;

    const whatsappUrl = buildWhatsAppUrl(texto);

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setFormStatus(
      "Mensagem preparada! O WhatsApp foi aberto para concluir o envio.",
    );

    event.currentTarget.reset();
  }

  return (
    <Layout>
      <main className="contato-page page-bg page-viewport">
        <section className="contato-section page-section">
          <div className="contato-content page-container">
            <aside className="contato-info">
              <h1>
                <span>FALA</span>
                <span>COM A</span>
                <span>GENTE</span>
              </h1>

              <p>
                Dúvidas, parcerias, ideias ou só chegar junto? Cola com nóis.
              </p>

              <ul className="contato-list">
                <li>
                  <FaEnvelope aria-hidden="true" />

                  <a href={`mailto:${siteContacts.email}`}>
                    {siteContacts.email}
                  </a>
                </li>

                <li>
                  <FaPhoneAlt aria-hidden="true" />

                  <a
                    href={buildWhatsAppUrl(
                      siteContacts.whatsappMessages.contact,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {siteContacts.phone.display}
                  </a>
                </li>

                <li>
                  <FaMapMarkerAlt aria-hidden="true" />
                  <span>{siteContacts.location}</span>
                </li>
              </ul>

              <div className="contato-social">
                <a
                  href={siteContacts.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da Chouga Skateboard"
                >
                  <FaInstagram aria-hidden="true" />
                </a>

                <a
                  href={buildWhatsAppUrl(siteContacts.whatsappMessages.contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp da Chouga Skateboard"
                >
                  <FaWhatsapp aria-hidden="true" />
                </a>
              </div>
            </aside>

            <form className="contato-form" onSubmit={handleSubmit}>
              <div className="contato-honeypot" aria-hidden="true">
                <label>
                  <span>Website</span>
                  <input
                    type="text"
                    name="website"
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </label>
              </div>

              <label>
                <span>Nome</span>
                <input type="text" name="nome" autoComplete="name" required />
              </label>

              <label>
                <span>E-mail</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                />
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

              {formStatus && (
                <p className="contato-form-status" role="status">
                  {formStatus}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Contato;
