import { FaInstagram, FaWhatsapp } from "react-icons/fa";

import "../css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container page-container">
        <div className="footer-brand">
          <span className="footer-logo">CHOUGA</span>

          <p>
            Nas ruas, feito nas ruas
            <br />
            para as ruas.
          </p>
        </div>

        <div className="footer-links">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram />
            Instagram
          </a>

          <a
            href="https://wa.me/5541997485063"
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp />
            WhatsApp
          </a>
        </div>

        <div className="footer-copy">
          <span>© 2026 Chouga Online</span>

          <small>
            Underground skatewear culture.
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;