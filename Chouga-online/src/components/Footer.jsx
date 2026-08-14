import { FaInstagram, FaWhatsapp } from "react-icons/fa";

import "../css/footer.css";
import logoFooter from "../assets/logo/Logo-desfigurada-transparente.png";

import { buildWhatsAppUrl, siteContacts } from "../constants/siteContacts";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container page-container">
        <div className="footer-brand">
          <div className="footer-logo-wrapper">
            <img
              className="footer-logo"
              src={logoFooter}
              alt="Logo Chouga Skateboard"
            />

            <span className="footer-logo-mark">®</span>
          </div>

          <p>
            Feito nas ruas.
            <br />
            Para quem vive o corre.
          </p>
        </div>

        <div className="footer-links">
          <a
            href={siteContacts.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Chouga Skateboard"
          >
            <FaInstagram aria-hidden="true" />
            Instagram
          </a>

          <a
            href={buildWhatsAppUrl(siteContacts.whatsappMessages.footer)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp da Chouga Skateboard"
          >
            <FaWhatsapp aria-hidden="true" />
            WhatsApp
          </a>
        </div>

        <div className="footer-copy">
          <span>© 2026 Chouga</span>

          <small>Underground skatewear culture.</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
