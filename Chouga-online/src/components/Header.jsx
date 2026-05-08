import { Link } from "react-router-dom";
import "../css/header.css";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        CHOUGA
      </Link>

      <nav className="nav">
        <Link to="/camisetas">Camisetas</Link>
        <Link to="/shapes">Shapes</Link>
        <Link to="/sobre">Sobre</Link>
        <Link to="/contato">Contato</Link>
      </nav>
    </header>
  );
}

export default Header;