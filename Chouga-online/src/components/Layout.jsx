import Header from "./Header";
import Footer from "./Footer";

function Layout({ children, hideFooter = false }) {
  return (
    <div className="app-layout">
      <Header />

      <div className="app-content">{children}</div>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default Layout;
