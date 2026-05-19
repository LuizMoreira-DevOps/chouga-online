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