import PageBackground from "./PageBackground";

function PageShell({ children, className = "", showBackground = false }) {
  const classes = `${className} page-bg`.trim();

  return (
    <main className={classes}>
      {showBackground && <PageBackground />}
      {children}
    </main>
  );
}

export default PageShell;
