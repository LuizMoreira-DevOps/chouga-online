import Header from "./Header";
import Footer from "./Footer";

function Layout({ children, hideFooter = false }) {
  return (
    <>
      <Header />
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}

export default Layout;