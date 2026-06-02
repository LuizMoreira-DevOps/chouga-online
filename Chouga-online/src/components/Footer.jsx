import { FaInstagram, FaWhatsapp } from "react-icons/fa";

import "../css/footer.css";
import logoFooter from "../assets/logo/Logo-desfigurada-transparente.png";

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
                        href="https://instagram.com/chougaskateboard_/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram da Chouga Skateboard"
                    >
                        <FaInstagram aria-hidden="true" />
                        Instagram
                    </a>

                    <a
                        href="https://wa.me/5541997485063?text=Salve%2C%20Chouga!%20Vim%20pelo%20site%20e%20queria%20saber%20mais%20sobre%20os%20produtos."
                        target="_blank"
                        rel="noreferrer"
                        aria-label="WhatsApp da Chouga Skateboard"
                    >
                        <FaWhatsapp aria-hidden="true" />
                        WhatsApp
                    </a>
                </div>

                <div className="footer-copy">
                    <span>© 2026 Chouga</span>

                    <small>
                        Underground skatewear culture.
                    </small>
                </div>
            </div>
        </footer>
    );
}

export default Footer;